import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { useMessageStore } from '@/features/Chat/stores/useMessageStore';
import { useAuthStore } from '@/features/Auth/stores/useAuthStore';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/types/message.types';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { updateMessage, deleteMessage } = useMessageStore();
  const { user } = useAuthStore();

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await updateMessage(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(message.id);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const menuItems = [
    { id: 'Copy', icon: Copy, label: 'Copy Text', onClick: handleCopy },
    ...(isOwn
      ? [
          { id: 'Edit', icon: Edit, label: 'Edit', onClick: () => setIsEditing(true) },
          { id: 'Trash2', icon: Trash2, label: 'Delete', onClick: handleDelete, destructive: true },
        ]
      : []),
  ];

  const renderContent = () => {
    if (message.type === 'image') {
      return (
        <div className="mt-2">
          <img
            src={message.fileUrl}
            alt={message.fileName}
            className="max-w-sm max-h-64 rounded-lg cursor-pointer hover:opacity-90"
            onClick={() => window.open(message.fileUrl, '_blank')}
          />
        </div>
      );
    } else if (message.type === 'file') {
      return (
        <div className="mt-2">
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Paperclip size={16} className="mr-2" />
            <span className="text-sm">{message.fileName}</span>
            <span className="text-xs text-gray-500 ml-2">
              ({(message.fileSize / 1024 / 1024).toFixed(1)} MB)
            </span>
          </a>
        </div>
      );
    } else {
      return (
        <div className="mt-1">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={handleEdit}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              rows={Math.min(editContent.split('\n').length, 5)}
              autoFocus
            />
          ) : (
            <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {message.content}
              {message.edited && <span className="text-xs text-gray-500 ml-2">(edited)</span>}
            </p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="group flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
      <Avatar src={message.author.avatar} alt={message.author.username} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {message.author.username}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>

        {renderContent()}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Dropdown
          items={menuItems}
          trigger={
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal size={16} />
            </button>
          }
        />
      </div>
    </div>
  );
};

export default MessageItem;
