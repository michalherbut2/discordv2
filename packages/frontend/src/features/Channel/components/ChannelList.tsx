import React, { useEffect, useState } from 'react';
import { Plus, Hash, Volume2, Settings } from 'lucide-react';
import { useServerStore } from '../../Server/stores/useServerStore';
import { useAuthStore } from '../../Auth/stores/useAuthStore';
import ChannelItem from './ChannelItem';
import CreateChannel from './CreateChannel';
import Dropdown from '@/components/ui/Dropdown';

interface ChannelListProps {
  serverId: string;
}

const ChannelList: React.FC<ChannelListProps> = ({ serverId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { servers, loadChannels, currentServer, channels } = useServerStore();
  const { user } = useAuthStore();

  const server = servers.find((s) => s.id === serverId);
  // const channels = server?.channels || [];
  const textChannels = channels.filter((c) => c.type === 'text');
  const voiceChannels = channels.filter((c) => c.type === 'voice');

  const isOwner = server?.ownerId === user?.id;
  const canManageChannels = isOwner; // Add permission check logic

  useEffect(() => {
    if (serverId) {
      loadChannels(serverId);
    }
  }, [serverId, loadChannels]);

  const serverMenuItems = [
    ...(canManageChannels
      ? [
          {
            id: 'Settings',
            icon: Settings,
            label: 'Server Settings',
            onClick: () => {
              // Open server settings modal
            },
          },
          {
            id: 'Plus',
            icon: Plus,
            label: 'Create Channel',
            onClick: () => {
              setShowCreateModal(true);
              console.log('Create Channel clicked', showCreateModal);
            },
          },
        ]
      : []),
  ];

  return (
    <div className="w-60 bg-gray-800 flex flex-col">
      {/* Server Header */}
      <div className="p-4 border-b border-gray-700">
        <Dropdown
          items={serverMenuItems}
          trigger={
            <button className="w-full flex items-center justify-between text-white hover:bg-gray-700 p-2 rounded">
              <span className="font-semibold truncate">{server?.name}</span>
              <span className="text-gray-400">▼</span>
            </button>
          }
        />
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Text Channels */}
        {textChannels.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Text Channels
              </h3>
              {canManageChannels && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {textChannels.map((channel) => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        )}

        {/* Voice Channels */}
        {voiceChannels.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Voice Channels
              </h3>
              {canManageChannels && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {voiceChannels.map((channel) => (
                <ChannelItem key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {channels.length === 0 && (
          <div className="text-center py-8">
            <Hash size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-sm mb-4">No channels yet</p>
            {canManageChannels && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Create your first channel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <CreateChannel
          isOpen={showCreateModal}
          serverId={serverId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default ChannelList;
