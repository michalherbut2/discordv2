import { useEffect } from 'react';
import { useMessageStore } from '../features/Chat/stores/useMessageStore';
import { messageService } from '@/features/Chat/services/message.service';

export const useMessages = (channelId: string) => {
  const {
    messages,
    isLoading,
    error,
    addMessage,
    updateMessage,
    deleteMessage,
    setMessages,
    setLoading,
    setError,
  } = useMessageStore();

  const channelMessages = messages[channelId] || [];

  useEffect(() => {
    if (channelId) {
      loadMessages();
    }
  }, [channelId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getMessages(channelId);
      setMessages(channelId, response.data);
    } catch (error) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    console.log('in useMessage: channelId:', channelId, 'Sending message:', content, 'Type:', type);

    try {
      const response = await messageService.sendMessage(channelId, content, type);
      addMessage(channelId, response);
      return response;
    } catch (error) {
      setError('Failed to send message');
      throw error;
    }
  };

  const editMessage = async (messageId: string, content: string) => {
    try {
      const response = await messageService.editMessage(messageId, content);
      updateMessage(channelId, messageId, response.data);
      return response.data;
    } catch (error) {
      setError('Failed to edit message');
      throw error;
    }
  };

  const removeMessage = async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      deleteMessage(channelId, messageId);
    } catch (error) {
      setError('Failed to delete message');
      throw error;
    }
  };

  return {
    messages: channelMessages,
    isLoading,
    error,
    sendMessage,
    editMessage,
    removeMessage,
    loadMessages,
  };
};
