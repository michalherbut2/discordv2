// packages/frontend/src/components/Chat/ChatArea.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useMessageStore } from '@/features/Chat/stores/useMessageStore';
import { useServerStore } from '@/features/Server/stores/useServerStore';
import { useMessages } from '@/hooks/useMessage';
import MessageItem from '@/features/Chat/components/MessageItem';
import MessageInput from '@/features/Chat/components/MessageInput';
import TypingIndicator from '@/features/Chat/components/TypingIndicator';

export const ChatArea: React.FC = () => {
  const { currentChannel } = useServerStore();
  const {
    // messages,
    fetchMessages,
    // sendMessage,
    typingUsers,
    getMessagesForChannel,
    isLoading,
    error,
  } = useMessageStore();
  const currentChannelId = currentChannel?.id || '';
  console.log('Current Channel:', currentChannelId);

  const { sendMessage, updateMessage, deleteMessage } = useMessages(currentChannelId || '');

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Get messages for current channel
  const messages = currentChannel ? getMessagesForChannel(currentChannelId) : [];
  const currentTypingUsers = currentChannel ? typingUsers[currentChannelId] || [] : [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch messages for the selected channel
  useEffect(() => {
    if (currentChannel) {
      fetchMessages(currentChannel.id);
    }
  }, [currentChannel, fetchMessages]);

  const handleSend = async () => {
    if (!input.trim() || !currentChannel) return;
    try {
      await sendMessage(input, 'text');
      setInput('');
    } catch (error) {
      // Error is already handled in the store and displayed via error state
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a channel to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 bg-gray-900 shadow-sm">
        <h2 className="text-xl font-semibold text-white">#{currentChannel.name}</h2>
        {currentChannel.description && (
          <p className="text-gray-400 text-sm mt-1">{currentChannel.description}</p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {currentTypingUsers.length > 0 && <TypingIndicator users={currentTypingUsers} />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-b border-gray-700 p-4 bg-gray-900 shadow-sm">
        <MessageInput
          channelId={currentChannelId}
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          placeholder={`Message #${currentChannel.name}`}
        />
      </div>
    </div>
  );
};
