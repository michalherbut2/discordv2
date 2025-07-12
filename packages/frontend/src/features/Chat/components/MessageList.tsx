// src/components/Chat/MessageList.tsx
import React, { useEffect, useRef } from 'react';
import { useMessageStore } from '../stores/useMessageStore';
import { useAuthStore } from '../../Auth/stores/useAuthStore';
import MessageItem from './MessageItem';
import TypingIndicator from '../TypingIndicator';

interface MessageListProps {
  channelId: string;
}

const MessageList: React.FC<MessageListProps> = ({ channelId }) => {
  const { messages, loading, loadMessages, hasMore, loadMoreMessages } = useMessageStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages(channelId);
  }, [channelId, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      if (scrollTop === 0 && hasMore && !loading) {
        loadMoreMessages(channelId);
      }
    }
  };

  const channelMessages = messages[channelId] || [];

  return (
    <div className="flex-1 overflow-hidden">
      <div ref={containerRef} className="h-full overflow-y-auto px-4 py-2" onScroll={handleScroll}>
        {loading && channelMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {hasMore && (
          <div className="text-center py-2">
            <button
              onClick={() => loadMoreMessages(channelId)}
              disabled={loading}
              className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load more messages'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {channelMessages.map((message) => (
            <MessageItem key={message.id} message={message} isOwn={message.authorId === user?.id} />
          ))}
        </div>

        <TypingIndicator channelId={channelId} />
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
