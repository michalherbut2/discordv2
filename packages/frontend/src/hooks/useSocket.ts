// hooks/useSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { socketService } from '../services/socket';
import { useAuthStore } from '../features/Auth/stores/useAuthStore';
import { useUIStore } from '../store/useUIStore';

interface UseSocketOptions {
  autoConnect?: boolean;
  reconnectOnAuthChange?: boolean;
}

interface UseSocketReturn {
  isConnected: boolean;
  socketId: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  sendMessage: (
    channelId: string,
    content: string,
    type?: 'text' | 'image' | 'file',
    file?: File
  ) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  updateUserStatus: (status: 'online' | 'away' | 'busy' | 'offline') => void;
  startTyping: (channelId: string) => void;
  stopTyping: (channelId: string) => void;
  joinServer: (serverId: string) => void;
  leaveServer: (serverId: string) => void;
}

export const useSocket = (options: UseSocketOptions = {}): UseSocketReturn => {
  const { autoConnect = true, reconnectOnAuthChange = true } = options;

  const { isAuthenticated } = useAuthStore();
  const { addNotification } = useUIStore();
  const connectionAttempted = useRef(false);
  const lastAuthState = useRef(isAuthenticated);

  // Connect to socket when component mounts and user is authenticated
  useEffect(() => {
    if (autoConnect && isAuthenticated && !connectionAttempted.current) {
      connectionAttempted.current = true;
      socketService.connect().catch((error) => {
        console.error('Failed to connect to socket:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to connect to server',
          timestamp: new Date(),
        });
      });
    }
  }, [isAuthenticated, autoConnect, addNotification]);

  // Handle auth state changes
  useEffect(() => {
    if (reconnectOnAuthChange && lastAuthState.current !== isAuthenticated) {
      lastAuthState.current = isAuthenticated;

      if (isAuthenticated) {
        // User just logged in, connect
        socketService.connect().catch((error) => {
          console.error('Failed to connect to socket after login:', error);
        });
      } else {
        // User logged out, disconnect
        socketService.disconnect();
        connectionAttempted.current = false;
      }
    }
  }, [isAuthenticated, reconnectOnAuthChange]);

  // Disconnect when component unmounts
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Socket methods wrapped with error handling
  const connect = useCallback(async () => {
    try {
      await socketService.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      addNotification({
        id: Math.random().toString(36).substr(2, 9),
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to server',
        timestamp: new Date(),
      });
      throw error;
    }
  }, [addNotification]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    connectionAttempted.current = false;
  }, []);

  const reconnect = useCallback(async () => {
    try {
      await socketService.reconnect();
    } catch (error) {
      console.error('Failed to reconnect:', error);
      addNotification({
        id: Math.random().toString(36).substr(2, 9),
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to reconnect to server',
        timestamp: new Date(),
      });
      throw error;
    }
  }, [addNotification]);

  const sendMessage = useCallback(
    (channelId: string, content: string, type: 'text' | 'image' | 'file' = 'text', file?: File) => {
      try {
        console.log('Sending message in useSocket:', "Channel:", channelId, "Content:", content, 'Type:', type);
        
        socketService.sendMessage(channelId, content, type, file);
      } catch (error) {
        console.error('Failed to send message:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Message Error',
          message: 'Failed to send message',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      try {
        socketService.editMessage(messageId, content);
      } catch (error) {
        console.error('Failed to edit message:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Message Error',
          message: 'Failed to edit message',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      try {
        socketService.deleteMessage(messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Message Error',
          message: 'Failed to delete message',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const joinChannel = useCallback(
    (channelId: string) => {
      try {
        socketService.joinChannel(channelId);
      } catch (error) {
        console.error('Failed to join channel:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Channel Error',
          message: 'Failed to join channel',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const leaveChannel = useCallback(
    (channelId: string) => {
      try {
        socketService.leaveChannel(channelId);
      } catch (error) {
        console.error('Failed to leave channel:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Channel Error',
          message: 'Failed to leave channel',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const updateUserStatus = useCallback(
    (status: 'online' | 'away' | 'busy' | 'offline') => {
      try {
        socketService.updateUserStatus(status);
      } catch (error) {
        console.error('Failed to update user status:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Status Error',
          message: 'Failed to update status',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const startTyping = useCallback((channelId: string) => {
    try {
      socketService.startTyping(channelId);
    } catch (error) {
      console.error('Failed to start typing:', error);
    }
  }, []);

  const stopTyping = useCallback((channelId: string) => {
    try {
      socketService.stopTyping(channelId);
    } catch (error) {
      console.error('Failed to stop typing:', error);
    }
  }, []);

  const joinServer = useCallback(
    (serverId: string) => {
      try {
        socketService.joinServer(serverId);
      } catch (error) {
        console.error('Failed to join server:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Server Error',
          message: 'Failed to join server',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  const leaveServer = useCallback(
    (serverId: string) => {
      try {
        socketService.leaveServer(serverId);
      } catch (error) {
        console.error('Failed to leave server:', error);
        addNotification({
          id: Math.random().toString(36).substr(2, 9),
          type: 'error',
          title: 'Server Error',
          message: 'Failed to leave server',
          timestamp: new Date(),
        });
      }
    },
    [addNotification]
  );

  return {
    isConnected: socketService.isConnected(),
    socketId: socketService.getSocketId(),
    connect,
    disconnect,
    reconnect,
    sendMessage,
    editMessage,
    deleteMessage,
    joinChannel,
    leaveChannel,
    updateUserStatus,
    startTyping,
    stopTyping,
    joinServer,
    leaveServer,
  };
};

// Custom hook for typing functionality with auto-cleanup
export const useTyping = (channelId: string) => {
  const { startTyping, stopTyping } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  const handleStartTyping = useCallback(() => {
    if (!channelId) return;

    startTyping(channelId);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(channelId);
    }, 3000);
  }, [channelId, startTyping, stopTyping]);

  const handleStopTyping = useCallback(() => {
    if (!channelId) return;

    stopTyping(channelId);

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [channelId, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (channelId) {
        stopTyping(channelId);
      }
    };
  }, [channelId, stopTyping]);

  return {
    startTyping: handleStartTyping,
    stopTyping: handleStopTyping,
  };
};
