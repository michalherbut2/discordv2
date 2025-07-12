import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { ChatArea } from '@/features/Chat/components/ChatArea';
import { useUIStore } from '@/store/useUIStore';
import { useServerStore } from '@/features/Server/stores/useServerStore';

const MainLayout: React.FC = () => {
  const { isSidebarOpen } = useUIStore();
  const { currentServer, currentChannel } = useServerStore();

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 flex min-h-0">
          <Routes>
            <Route path="/" element={<ChatArea />} />
            <Route path="/servers/:serverId" element={<ChatArea />} />
            <Route path="/servers/:serverId/channels/:channelId" element={<ChatArea />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
