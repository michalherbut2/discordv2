import { useServerStore } from '@/features/Server/stores/useServerStore';
import { useEffect } from 'react';
import { fetchServers } from '@/services/server.service';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import CreateServer from '../Server/CreateServer';

export default function Home() {
  const { setServers } = useServerStore();
  const navigate = useNavigate();

  useEffect(() => {
    const goToDefault = async () => {
      const servers = await fetchServers();
      setServers(servers);

      if (servers.length > 0) {
        // Optional: pick last active or first server
        const serverId = servers[0].id;
        const channels = servers[0].channels ?? []; // optional optimization
        const channelId = channels[0]?.id;

        if (channelId) {
          navigate(`/server/${serverId}/channel/${channelId}`);
          return;
        }
      }
    };

    goToDefault();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-discord-dark text-white">
      <MainLayout />

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Discord Clone 👋</h1>
        <p className="text-gray-400">Join or create a server to start chatting.</p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/profile')}
            className="bg-discord-blurple text-white px-4 py-2 rounded"
          >
            Go to Profile
          </button>
        </div>
        <CreateServer />
      </div>
    </div>
  );
}
