import React from 'react';
import { Menu, Hash, Volume2, Settings, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { useUIStore } from '@/store/useUIStore';
import { useServerStore } from '@/features/Server/stores/useServerStore';
import { useAuthStore } from '@/features/Auth/stores/useAuthStore';

const Header: React.FC = () => {
  const { toggleSidebar, openModal } = useUIStore();
  const { currentServer, currentChannel } = useServerStore();
  const { user } = useAuthStore();

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <Volume2 size={20} />;
      default:
        return <Hash size={20} />;
    }
  };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
          <Menu size={20} />
        </Button>

        {currentChannel && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">{getChannelIcon(currentChannel.type)}</span>
            <h1 className="text-lg font-semibold text-white">{currentChannel.name}</h1>
            {currentChannel.description && (
              <span className="text-gray-400 text-sm hidden md:block">
                {currentChannel.description}
              </span>
            )}
          </div>
        )}

        {!currentChannel && currentServer && (
          <h1 className="text-lg font-semibold text-white">{currentServer.name}</h1>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => openModal('userList')}>
          <Users size={20} />
        </Button>

        <Button variant="ghost" size="sm" onClick={() => openModal('settings')}>
          <Settings size={20} />
        </Button>

        {user && (
          <div className="flex items-center space-x-2">
            <Avatar src={user.avatar} alt={user.username} size="sm" status={user.status} />
            <span className="text-sm text-white hidden md:block">{user.username}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
