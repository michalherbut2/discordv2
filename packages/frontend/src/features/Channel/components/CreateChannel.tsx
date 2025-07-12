import React, { useState } from 'react';
import { Hash, Volume2 } from 'lucide-react';
import { useServerStore } from '@/features/Server/stores/useServerStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface CreateChannelProps {
  serverId: string;
  isOpen: boolean; // Optional prop for modal visibility
  onClose: () => void;
}

const CreateChannel: React.FC<CreateChannelProps> = ({ serverId, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'text' | 'voice'>('text');
  const [loading, setLoading] = useState(false);
  const { createChannel } = useServerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createChannel(serverId, {
        name: name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        type,
      });
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Create Channel</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Channel Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="text"
                  checked={type === 'text'}
                  onChange={(e) => setType(e.target.value as 'text')}
                  className="text-blue-600"
                />
                <Hash size={20} className="text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Text</div>
                  <div className="text-sm text-gray-500">Send messages, images, and files</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="voice"
                  checked={type === 'voice'}
                  onChange={(e) => setType(e.target.value as 'voice')}
                  className="text-blue-600"
                />
                <Volume2 size={20} className="text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Voice</div>
                  <div className="text-sm text-gray-500">Talk with voice and video</div>
                </div>
              </label>
            </div>
          </div>

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
            <p className="mt-1 text-xs text-gray-500">Use lowercase letters, numbers, and dashes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Channel Description (Optional)
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
              Create Channel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateChannel;
