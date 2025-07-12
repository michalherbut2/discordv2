import React from 'react';
import { Hash, Volume2, Settings, Trash2 } from 'lucide-react';
import type { Channel } from '@/types/server.types';
import { useServerStore } from '@/features/Server/stores/useServerStore';
import { useAuthStore } from '@/features/Auth/stores/useAuthStore';
import Dropdown from '@/components/ui/Dropdown';

interface ChannelItemProps {
  channel: Channel;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel }) => {
  const { currentChannel, setCurrentChannel, deleteChannel } = useServerStore();
  const { user } = useAuthStore();

  const isActive = currentChannel?.id === channel.id;
  const isText = channel.type === 'text';
  const Icon = isText ? Hash : Volume2;

  // Check if user can manage this channel
  const canManage = true; // Add permission logic here

  const handleClick = () => {
    setCurrentChannel(channel);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete #${channel.name}?`)) {
      await deleteChannel(channel.id);
    }
  };

  const menuItems = canManage
    ? [
        { id: 'Settings', icon: Settings, label: 'Edit Channel', onClick: () => {} },
        {
          id: 'Trash2',
          icon: Trash2,
          label: 'Delete Channel',
          onClick: handleDelete,
          destructive: true,
        },
      ]
    : [];

  return (
    <div className="group relative">
      <div
        onClick={handleClick}
        className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors ${
          isActive
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
        }`}
      >
        <Icon size={16} />
        <span className="text-sm font-medium truncate">{channel.name}</span>
      </div>

      {menuItems.length > 0 && (
        <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dropdown
            items={menuItems}
            trigger={
              <button className="p-1 text-gray-400 hover:text-white">
                <Settings size={14} />
              </button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ChannelItem;
