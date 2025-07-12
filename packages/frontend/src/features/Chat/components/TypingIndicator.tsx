import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../hooks/useSocket';
import { useAuthStore } from '../../Auth/stores/useAuthStore';

interface TypingIndicatorProps {
  channelId: string;
}

interface TypingUser {
  userId: string;
  username: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ channelId }) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { socket } = useSocket();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    const handleTypingStart = (data: { userId: string; channelId: string; username: string }) => {
      if (data.channelId === channelId && data.userId !== user?.id) {
        setTypingUsers((prev) => {
          const exists = prev.find((u) => u.userId === data.userId);
          if (!exists) {
            return [...prev, { userId: data.userId, username: data.username }];
          }
          return prev;
        });
      }
    };

    const handleTypingStop = (data: { userId: string; channelId: string }) => {
      if (data.channelId === channelId) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
    };
  }, [socket, channelId, user?.id]);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="flex space-x-1">
          <div
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <span>{getTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
