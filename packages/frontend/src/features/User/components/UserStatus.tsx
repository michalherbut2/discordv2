import React from 'react';
import { useAuthStore } from '../../Auth/stores/useAuthStore';
import { useSocket } from '../../../hooks/useSocket';

type UserStatus = 'online' | 'away' | 'busy' | 'offline';

interface UserStatusProps {
  userId?: string;
  status?: UserStatus;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const UserStatus: React.FC<UserStatusProps> = ({
  userId,
  status: propStatus,
  showText = false,
  size = 'md',
  interactive = false,
}) => {
  const { user } = useAuthStore();
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = React.useState(false);

  // Use prop status or current user status
  const status = propStatus || (userId === user?.id ? user?.status : 'offline') || 'offline';

  const statusConfig = {
    online: { color: 'bg-green-500', text: 'Online' },
    away: { color: 'bg-yellow-500', text: 'Away' },
    busy: { color: 'bg-red-500', text: 'Busy' },
    offline: { color: 'bg-gray-500', text: 'Offline' },
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const handleStatusChange = (newStatus: UserStatus) => {
    if (socket && userId === user?.id) {
      socket.emit('user:status', { status: newStatus });
    }
    setIsOpen(false);
  };

  const StatusIndicator = () => (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} ${statusConfig[status].color} rounded-full border-2 border-white`}
      />
      {interactive && userId === user?.id && (
        <div className="absolute inset-0 rounded-full bg-transparent cursor-pointer" />
      )}
    </div>
  );

  if (!interactive || userId !== user?.id) {
    return (
      <div className="flex items-center gap-2">
        <StatusIndicator />
        {showText && <span className="text-sm text-gray-600">{statusConfig[status].text}</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <StatusIndicator />
        {showText && <span className="text-sm text-gray-600">{statusConfig[status].text}</span>}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 min-w-[120px]">
            {(Object.keys(statusConfig) as UserStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => handleStatusChange(statusOption)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                  status === statusOption ? 'bg-gray-100' : ''
                }`}
              >
                <div className={`w-3 h-3 ${statusConfig[statusOption].color} rounded-full`} />
                {statusConfig[statusOption].text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserStatus;
