import React, { useState } from 'react';
import { Settings, Users, Hash, Shield, Trash2, X } from 'lucide-react';
import { useServerStore } from '../stores/useServerStore';
import { useAuthStore } from '../../Auth/stores/useAuthStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

interface ServerSettingsProps {
  serverId: string;
  onClose: () => void;
}

const ServerSettings: React.FC<ServerSettingsProps> = ({ serverId, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const { servers, updateServer, deleteServer } = useServerStore();
  const { user } = useAuthStore();

  const server = servers.find((s) => s.id === serverId);
  const [name, setName] = useState(server?.name || '');
  const [description, setDescription] = useState(server?.description || '');
  const [loading, setLoading] = useState(false);

  if (!server) return null;

  const isOwner = server.ownerId === user?.id;
  const isAdmin = isOwner; // Add admin check logic here

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await updateServer(serverId, {
        name: name.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to update server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm('Are you sure you want to delete this server? This action cannot be undone.')
    ) {
      return;
    }

    setLoading(true);
    try {
      await deleteServer(serverId);
      onClose();
    } catch (error) {
      console.error('Failed to delete server:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'channels', label: 'Channels', icon: Hash },
    ...(isAdmin ? [{ id: 'permissions', label: 'Permissions', icon: Shield }] : []),
  ];

  return (
    <Modal onClose={onClose} className="max-w-4xl">
      <div className="flex h-96">
        {/* Sidebar */}
        <div className="w-56 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Server Settings
          </h3>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}

            {isOwner && (
              <button
                onClick={handleDelete}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete Server</span>
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  General Settings
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Server Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter server name"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Server Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter server description"
                      rows={3}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={loading}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Server Members
              </h4>
              <p className="text-gray-600 dark:text-gray-400">Member management coming soon...</p>
            </div>
          )}

          {activeTab === 'channels' && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Channel Management
              </h4>
              <p className="text-gray-600 dark:text-gray-400">Channel management coming soon...</p>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Permissions
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Permission management coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ServerSettings;
