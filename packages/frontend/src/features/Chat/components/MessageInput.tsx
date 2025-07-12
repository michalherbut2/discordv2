// packages/frontend/src/components/Chat/MessageInput.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import FileUpload from './FileUpload';
import Button from '@/components/ui/Button';

interface MessageInputProps {
  channelId: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ channelId, disabled = false }) => {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { sendMessage, startTyping, stopTyping, isConnected } = useSocket();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [channelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled || !isConnected) return;

    try {
      console.log('Sending message in MessageInput:', content.trim(), 'to channel:', channelId);
      
      await sendMessage(channelId, content.trim(), 'text');
      setContent('');
      handleStopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    handleTyping();
  };

  const handleTyping = () => {
    if (!isConnected) return;

    if (!isTyping) {
      setIsTyping(true);
      startTyping(channelId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping && isConnected) {
      setIsTyping(false);
      stopTyping(channelId);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Stop typing when component unmounts
      if (isTyping && isConnected) {
        stopTyping(channelId);
      }
    };
  }, [channelId, isTyping, isConnected, stopTyping]);

  const handleFileUpload = async (file: File, type: 'image' | 'file') => {
    try {
      await sendMessage(channelId, '', type, file);
      setShowFileUpload(false);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={content}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={handleStopTyping}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={disabled || !isConnected}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={disabled || !isConnected}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Paperclip size={20} />
            </button>
            
            <button
              type="button"
              disabled={disabled || !isConnected}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smile size={20} />
            </button>
            
            <Button
              type="submit"
              disabled={!content.trim() || disabled || !isConnected}
              size="sm"
              className="px-3"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </form>

      {showFileUpload && (
        <FileUpload
          onUpload={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;