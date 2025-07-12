import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useServerStore } from '@/features/Server/stores/useServerStore';
import ServerItem from './ServerItem';
import CreateServer from './CreateServer';
import JoinServer from './JoinServer';
// import Button from '@/components/ui/Button';
import { serverService } from '@/features/Server/services/server.service'; // or ServerService

const ServerList: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { servers, isLoading, setServers, setLoading, setError } = useServerStore();

  useEffect(() => {
    const loadServers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Option 1: Using dedicated server service
        const serverData = await serverService.getServers();
        console.log(serverData);

        setServers(serverData);
      } catch (error) {
        console.error('Failed to load servers:', error);
        setError(error instanceof Error ? error.message : 'Failed to load servers');
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, [setServers, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="w-16 bg-gray-900 flex flex-col items-center py-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-3 space-y-2">
      {/* Direct Messages */}
      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-gray-500 cursor-pointer transition-colors">
        DM
      </div>

      <div className="w-8 h-px bg-gray-600"></div>

      {/* Server List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {servers.map((server) => (
          <ServerItem key={server.id} server={server} />
        ))}
      </div>

      {/* Add Server Button */}
      <div className="space-y-2">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors group"
          title="Create Server"
        >
          <Plus size={20} className="group-hover:text-white" />
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors text-xs font-bold"
          title="Join Server"
        >
          +
        </button>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateServer onClose={() => setShowCreateModal(false)} />}

      {showJoinModal && <JoinServer onClose={() => setShowJoinModal(false)} />}
    </div>
  );
};

export default ServerList;
