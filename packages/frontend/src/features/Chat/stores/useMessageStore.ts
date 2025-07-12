// store/useMessageStore.ts
import { create } from 'zustand';
import type { Message } from '../../../types';
import { messageService } from '@/features/Chat/services/message.service';

interface MessageStore {
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, { userId: string; username: string }[]>; // channelId -> array of typing users

  // API Actions
  fetchMessages: (channelId: string, limit?: number, offset?: number) => Promise<void>;
  sendMessage: (
    channelId: string,
    content: string,
    type?: 'text' | 'image' | 'file',
    file?: File
  ) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (channelId: string, messageId: string) => Promise<void>;

  // Real-time updates (for WebSocket)
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  removeMessage: (channelId: string, messageId: string) => void;

  // Typing functionality
  addTypingUser: (channelId: string, user: { userId: string; username: string }) => void;
  removeTypingUser: (channelId: string, userId: string) => void;

  // Utility actions
  setMessages: (channelId: string, messages: Message[]) => void;
  clearMessages: (channelId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getMessagesForChannel: (channelId: string) => Message[];
  getTypingUsers: (channelId: string) => { userId: string; username: string }[];
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: {},
  isLoading: false,
  error: null,
  typingUsers: {},

  // API Actions
  fetchMessages: async (channelId, limit = 50, offset = 0) => {
    try {
      set({ isLoading: true, error: null });
      const messages = await messageService.getMessages(channelId, limit, offset);
      set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: messages,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        isLoading: false,
      });
    }
  },

  sendMessage: async (channelId, content, type = 'text', file) => {
    try {
      set({ error: null });
      const newMessage = await messageService.sendMessage(channelId, content, type, file);

      // Add the message to the store
      set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: [...(state.messages[channelId] || []), newMessage],
        },
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to send message' });
      throw error; // Re-throw so component can handle it
    }
  },

  editMessage: async (messageId, content) => {
    try {
      set({ error: null });
      const updatedMessage = await messageService.editMessage(messageId, content);

      // Update the message in all channels (we don't know which channel it belongs to)
      set((state) => {
        const newMessages = { ...state.messages };
        Object.keys(newMessages).forEach((channelId) => {
          newMessages[channelId] = newMessages[channelId].map((msg) =>
            msg.id === messageId ? updatedMessage : msg
          );
        });
        return { messages: newMessages };
      });
    } catch (error) {
      console.error('Failed to edit message:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to edit message' });
      throw error;
    }
  },

  deleteMessage: async (channelId, messageId) => {
    try {
      set({ error: null });
      await messageService.deleteMessage(messageId);

      // Remove the message from the store
      set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: state.messages[channelId]?.filter((msg) => msg.id !== messageId) || [],
        },
      }));
    } catch (error) {
      console.error('Failed to delete message:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete message' });
      throw error;
    }
  },

  // Real-time updates (for WebSocket integration)
  addMessage: (channelId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), message],
      },
    }));
  },

  updateMessage: (channelId, messageId, updates) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]:
          state.messages[channelId]?.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ) || [],
      },
    }));
  },

  removeMessage: (channelId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: state.messages[channelId]?.filter((msg) => msg.id !== messageId) || [],
      },
    }));
  },

  // Typing functionality
  addTypingUser: (channelId, user) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [channelId]: [
          ...(state.typingUsers[channelId] || []).filter((u) => u.userId !== user.userId),
          user,
        ],
      },
    }));
  },

  removeTypingUser: (channelId, userId) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [channelId]: (state.typingUsers[channelId] || []).filter((u) => u.userId !== userId),
      },
    }));
  },

  // Utility actions
  setMessages: (channelId, messages) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: messages,
      },
    }));
  },

  clearMessages: (channelId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [],
      },
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Getters
  getMessagesForChannel: (channelId) => {
    const state = get();
    return state.messages[channelId] || [];
  },

  getTypingUsers: (channelId) => {
    const state = get();
    return state.typingUsers[channelId] || [];
  },
}));
