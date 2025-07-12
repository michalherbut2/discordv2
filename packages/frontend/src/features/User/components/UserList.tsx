import React from 'react';
import { useServerStore } from '@/features/Server/stores/useServerStore';
import { useAuthStore } from '@/features/Auth/stores/useAuthStore';
import UserStatus from '@/features/User/components/UserStatus';

interface User {
  id: string;
  username: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role?: 'owner' | 'admin' | 'member';
}

interface UserListProps {
  serverId?: string;
  showOffline?: boolean;
  compact?: boolean;
}

const UserList: React.FC<UserListProps> = ({ serverId, showOffline = false, compact = false }) => {
  const { currentServer, serverMembers } = useServerStore();
  const { user } = useAuthStore();

  // Get members for the current server
  const members = React.useMemo(() => {
    if (!serverId && !currentServer) return [];

    // const targetServerId = serverId || currentServer?.id;
    const targetServerId = currentServer?.id;
    if (!targetServerId) return [];
    const members = serverMembers[targetServerId] || [];

    // Filter out offline users if showOffline is false
    const filteredMembers = showOffline
      ? members
      : members.filter((member) => member.status !== 'offline');

    // Sort by status (online first), then by role, then by username
    return filteredMembers.sort((a, b) => {
      // Status priority: online > away > busy > offline
      const statusPriority = { online: 0, away: 1, busy: 2, offline: 3 };
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];

      if (statusDiff !== 0) return statusDiff;

      // Role priority: owner > admin > member
      const rolePriority = { owner: 0, admin: 1, member: 2 };
      const roleDiff = rolePriority[a.role || 'member'] - rolePriority[b.role || 'member'];

      if (roleDiff !== 0) return roleDiff;

      // Alphabetical by username
      return a.username.localeCompare(b.username);
    });
  }, [serverId, currentServer, serverMembers, showOffline]);

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'owner':
        return 'text-purple-600';
      case 'admin':
        return 'text-blue-600';
      default:
        return 'text-gray-700';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'owner':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'admin':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (members.length === 0) {
    return <div className="p-4 text-center text-gray-500 text-sm">No users to display</div>;
  }

  return (
    <div className="space-y-1">
      {/* Online Users */}
      <div className="mb-4">
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Online — {members.filter((m) => m.status === 'online').length}</span>
        </div>
        {members
          .filter((member) => member.status === 'online')
          .map((member) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                compact ? 'py-1' : 'py-2'
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">
                      {member.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <UserStatus userId={member.id} status={member.status} size="sm" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium text-sm truncate ${
                      member.id === user?.id ? 'text-blue-600' : getRoleColor(member.role)
                    }`}
                  >
                    {member.username}
                    {member.id === user?.id && ' (You)'}
                  </span>
                  {member.role && member.role !== 'member' && (
                    <span className={getRoleColor(member.role)}>{getRoleIcon(member.role)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Offline Users */}
      {showOffline && members.filter((m) => m.status === 'offline').length > 0 && (
        <div>
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Offline — {members.filter((m) => m.status === 'offline').length}</span>
          </div>
          {members
            .filter((member) => member.status === 'offline')
            .map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer opacity-60 ${
                  compact ? 'py-1' : 'py-2'
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-600">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <UserStatus userId={member.id} status={member.status} size="sm" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium text-sm truncate ${
                        member.id === user?.id ? 'text-blue-600' : getRoleColor(member.role)
                      }`}
                    >
                      {member.username}
                      {member.id === user?.id && ' (You)'}
                    </span>
                    {member.role && member.role !== 'member' && (
                      <span className={getRoleColor(member.role)}>{getRoleIcon(member.role)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
