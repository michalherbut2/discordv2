import React from 'react';
import { Plus } from 'lucide-react';
import ServerList from '../Server/ServerList';
import ChannelList from '../Channel/ChannelList';
import UserList from '../User/UserList';
import Button from '../ui/Button';
import { useUIStore } from '../../store/useUIStore';
import { useServerStore } from '../../features/Server/stores/useServerStore';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, openModal } = useUIStore();
  const { currentServer } = useServerStore();

  if (!isSidebarOpen) return null;

  return (
    <div className="w-64 bg-gray-800 flex flex-col">
      {/* Server Info */}
      <div className="p-4 border-b border-gray-700">
        {currentServer ? (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white truncate">{currentServer.name}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('createChannel', { serverId: currentServer.id })}
            >
              <Plus size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Select a Server</h2>
            <Button variant="ghost" size="sm" onClick={() => openModal('createServer')}>
              <Plus size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Server List */}
      <div className="flex-1 flex flex-col min-h-0">
        <ServerList />

        {/* Channel List */}
        {currentServer && (
          <div className="flex-1 min-h-0">
            <ChannelList serverId={currentServer.id} />
          </div>
        )}
      </div>

      {/* User List */}
      <div className="border-t border-gray-700">
        <UserList />
      </div>
    </div>
  );
};

export default Sidebar;
