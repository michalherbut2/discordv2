// packages/frontend/src/services/socket.ts

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../features/Auth/stores/useAuthStore';
import { useMessageStore } from '../features/Chat/stores/useMessageStore';
import { useServerStore } from '../features/Server/stores/useServerStore';
import { useUIStore } from '../store/useUIStore';
import { STORAGE_KEYS } from '../utils/constants';
import type { Message, User } from '../types';

interface ServerToClientEvents {
  // 'message:new': (data: { message: Message; channel: any }) => void;
  'message:new': (message: Message) => void;
  'message:updated': (data: { message: Message }) => void;
  'message:deleted': (data: { messageId: string; channelId: string }) => void;
  'user:status': (data: { userId: string; status: string }) => void;
  'typing:start': (data: { userId: string; channelId: string; username: string }) => void;
  'typing:stop': (data: { userId: string; channelId: string }) => void;
  'user:joined': (data: { user: User; serverId: string }) => void;
  'user:left': (data: { userId: string; serverId: string }) => void;
  'channel:created': (data: { channel: any; serverId: string }) => void;
  'channel:updated': (data: { channel: any }) => void;
  'channel:deleted': (data: { channelId: string; serverId: string }) => void;
  'server:updated': (data: { server: any }) => void;
  'server:deleted': (data: { serverId: string }) => void;
  error: (error: { message: string; code?: string }) => void;
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
}

interface ClientToServerEvents {
  'message:send': (data: {
    channelId: string;
    content: string;
    type: 'text' | 'image' | 'file';
    file?: File;
  }) => void;
  'message:edit': (data: { messageId: string; content: string }) => void;
  'message:delete': (data: { messageId: string }) => void;
  'channel:join': (data: { channelId: string }) => void;
  'channel:leave': (data: { channelId: string }) => void;
  'user:status': (data: { status: 'online' | 'away' | 'busy' | 'offline' }) => void;
  'typing:start': (data: { channelId: string }) => void;
  'typing:stop': (data: { channelId: string }) => void;
  'server:join': (data: { serverId: string }) => void;
  'server:leave': (data: { serverId: string }) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private isConnecting = false;
  private unsubscribeAuth: (() => void) | null = null;

  constructor() {
    this.setupStoreSubscriptions();
  }

  private setupStoreSubscriptions() {
    // Subscribe to auth store changes
    this.unsubscribeAuth = useAuthStore.subscribe((state) => {
      if (state.isAuthenticated && state.token && !this.socket?.connected) {
        this.connect();
      } else if (!state.isAuthenticated && this.socket?.connected) {
        this.disconnect();
      }
    });
  }

  private getAuthToken(): string | null {
    // Try to get token from store first (most up-to-date)
    const storeToken = useAuthStore.getState().token;
    if (storeToken) return storeToken;

    // Fallback to localStorage
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.socket?.connected) {
        resolve();
        return;
      }

      const token = this.getAuthToken();
      if (!token) {
        reject(new Error('No authentication token available'));
        return;
      }

      this.isConnecting = true;
      const { addNotification } = useUIStore.getState();

      this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
      });

      this.setupEventListeners();

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        addNotification({
          type: 'success',
          message: 'Connected to server',
          duration: 3000,
        });
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnecting = false;

        // Handle auth errors specifically
        if (error.message?.includes('unauthorized') || error.message?.includes('token')) {
          this.handleAuthError();
        } else {
          this.handleReconnect();
        }

        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnecting = false;

        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.handleReconnect();
        }

        addNotification({
          type: 'warning',
          message: 'Disconnected from server',
          duration: 5000,
        });
      });
    });
  }

  private handleAuthError() {
    console.error('Socket authentication failed');
    const { addNotification } = useUIStore.getState();
    const { refreshTokenf, logout } = useAuthStore.getState();

    // Try to refresh token
    refreshTokenf()
      .then(() => {
        console.log('Token refreshed, attempting to reconnect');
        this.connect();
      })
      .catch((error) => {
        console.error('Token refresh failed:', error);
        addNotification({
          type: 'error',
          message: 'Authentication failed. Please login again.',
          duration: 5000,
        });
        logout();
      });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    const { addMessage, updateMessage, removeMessage } = useMessageStore.getState();
    const { updateUserStatus, addTypingUser, removeTypingUser } = useServerStore.getState();
    const { addNotification } = useUIStore.getState();

    // Message events
    // this.socket.on('message:new', ({ message, channel }) => {
    this.socket.on('message:new', (message) => {
      // console.log('New message received in socket.ts:', message, 'Channel:', channel);
      console.log('New message received in socket.ts:', message);
      addMessage(message.channelId, message);

      // Show notification for new messages (except from current user)
      const { user } = useAuthStore.getState();
      if (message.author.id !== user?.id) {
        addNotification({
          type: 'info',
          // message: `New message in #${channel.name}`,
          message: `New message in #${message.channelId}`,
          duration: 3000,
        });
      }
    });

    this.socket.on('message:updated', ({ message }) => {
      updateMessage(message.channelId, message.id, message);
    });

    this.socket.on('message:deleted', ({ messageId, channelId }) => {
      removeMessage(channelId, messageId);
    });

    // User status events
    this.socket.on('user:status', ({ userId, status }) => {
      updateUserStatus(userId, status);
    });

    // Typing events
    this.socket.on('typing:start', ({ userId, channelId, username }) => {
      addTypingUser(channelId, { userId, username });

      // Auto-remove typing indicator after 5 seconds
      const key = `${userId}-${channelId}`;
      if (this.typingTimeouts.has(key)) {
        clearTimeout(this.typingTimeouts.get(key)!);
      }

      const timeout = setTimeout(() => {
        removeTypingUser(channelId, userId);
        this.typingTimeouts.delete(key);
      }, 5000);

      this.typingTimeouts.set(key, timeout);
    });

    this.socket.on('typing:stop', ({ userId, channelId }) => {
      removeTypingUser(channelId, userId);
      const key = `${userId}-${channelId}`;
      if (this.typingTimeouts.has(key)) {
        clearTimeout(this.typingTimeouts.get(key)!);
        this.typingTimeouts.delete(key);
      }
    });

    // Server events
    this.socket.on('user:joined', ({ user, serverId }) => {
      const { addServerMember } = useServerStore.getState();
      addServerMember(serverId, user);
      addNotification({
        type: 'info',
        message: `${user.username} joined the server`,
        duration: 3000,
      });
    });

    this.socket.on('user:left', ({ userId, serverId }) => {
      const { removeServerMember } = useServerStore.getState();
      removeServerMember(serverId, userId);
    });

    this.socket.on('channel:created', ({ channel, serverId }) => {
      const { addChannel } = useServerStore.getState();
      addChannel(channel);
    });

    this.socket.on('channel:updated', ({ channel }) => {
      const { updateChannel } = useServerStore.getState();
      updateChannel(channel.id, channel);
    });

    this.socket.on('channel:deleted', ({ channelId, serverId }) => {
      const { removeChannel } = useServerStore.getState();
      removeChannel(channelId);
    });

    this.socket.on('server:updated', ({ server }) => {
      const { updateServer } = useServerStore.getState();
      updateServer(server.id, server);
    });

    this.socket.on('server:deleted', ({ serverId }) => {
      const { removeServer } = useServerStore.getState();
      removeServer(serverId);
    });

    // Error handling
    this.socket.on('error', ({ message, code }) => {
      console.error('Socket error:', message, code);

      // Handle specific error codes
      if (code === 'UNAUTHORIZED' || code === 'TOKEN_EXPIRED') {
        this.handleAuthError();
      } else {
        addNotification({
          type: 'error',
          message: `Error: ${message}`,
          duration: 5000,
        });
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      const { addNotification } = useUIStore.getState();
      addNotification({
        type: 'error',
        message: 'Failed to reconnect to server. Please refresh the page.',
        duration: 10000,
      });
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (!this.socket?.connected) {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    // Clear all typing timeouts
    this.typingTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.typingTimeouts.clear();

    // Unsubscribe from auth store
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
  }

  // Message methods
  sendMessage(
    channelId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    file?: File
  ) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    console.log('Sending message:', { channelId, content, type, file });

    this.socket.emit('message:send', { channelId, content, type, file });
  }

  editMessage(messageId: string, content: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('message:edit', { messageId, content });
  }

  deleteMessage(messageId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('message:delete', { messageId });
  }

  // Channel methods
  joinChannel(channelId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('channel:join', { channelId });
  }

  leaveChannel(channelId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('channel:leave', { channelId });
  }

  // User methods
  updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline') {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('user:status', { status });
  }

  // Typing methods
  startTyping(channelId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('typing:start', { channelId });
  }

  stopTyping(channelId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('typing:stop', { channelId });
  }

  // Server methods
  joinServer(serverId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('server:join', { serverId });
  }

  leaveServer(serverId: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('server:leave', { serverId });
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Manual reconnection method
  reconnect(): Promise<void> {
    this.disconnect();
    return this.connect();
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
