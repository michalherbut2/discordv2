import React, { useState } from 'react';
import { Channel } from '../../../types/server.types';
import { useServerStore } from '../../Server/stores/useServerStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

interface ChannelSettingsProps {
  channel: Channel;
  onClose: () => void;
}

const ChannelSettings: React.FC<ChannelSettingsProps> = ({ channel, onClose }) => {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || '');
  const [loading, setLoading] = useState(false);
  const { updateChannel } = useServerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await updateChannel(channel.id, {
        name: name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to update channel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Channel</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Channel Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter channel name"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Channel Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!name.trim()}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChannelSettings;
