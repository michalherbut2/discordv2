import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useServerStore } from '../stores/useServerStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface CreateServerProps {
  onClose: () => void;
}

const CreateServer: React.FC<CreateServerProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { createServer } = useServerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createServer({
        name: name.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to create server:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Create Your Server
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Server Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter server name"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Server Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your server about?"
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
              Create Server
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateServer;
