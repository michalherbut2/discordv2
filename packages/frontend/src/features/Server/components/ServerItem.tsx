import React from 'react';
import type { Server } from '@/types/server.types';
import { useServerStore } from '@/features/Server/stores/useServerStore';
// import Avatar from '@/components/ui/Avatar';

interface ServerItemProps {
  server: Server;
}

const ServerItem: React.FC<ServerItemProps> = ({ server }) => {
  const { currentServer, setCurrentServer } = useServerStore();
  const isActive = currentServer?.id === server.id;

  const handleClick = () => {
    setCurrentServer(server);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer transition-all duration-200 ${
        isActive ? 'translate-x-1' : ''
      }`}
      title={server.name}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
      )}

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 ${
          isActive ? 'bg-blue-600 rounded-2xl' : 'bg-gray-600 hover:bg-gray-500 hover:rounded-2xl'
        }`}
      >
        {server.icon ? (
          <img
            src={server.icon}
            alt={server.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-lg">
            {server.name
              .split(' ')
              .map((word) => word[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </span>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        {server.name}
      </div>
    </div>
  );
};

export default ServerItem;
