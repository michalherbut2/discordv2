import React, { useState } from 'react';
import { Camera, Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '../../Auth/stores/useAuthStore';
import { User } from '../../../types/auth.types';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

interface UserProfileProps {
  user?: User;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user: propUser, onClose }) => {
  const { user: currentUser, updateProfile } = useAuthStore();
  const user = propUser || currentUser;
  const isOwnProfile = !propUser || propUser.id === currentUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) return;

    setLoading(true);
    try {
      await updateProfile({
        username: username.trim(),
        email: email.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(user.username);
    setEmail(user.email);
    setIsEditing(false);
  };

  return (
    <Modal onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar src={user.avatar} alt={user.username} size="xl" className="mx-auto" />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>

          <div className="mt-4">
            <div className="inline-flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.username}
              </h2>
              <div
                className={`w-3 h-3 rounded-full ${
                  user.status === 'online'
                    ? 'bg-green-500'
                    : user.status === 'away'
                      ? 'bg-yellow-500'
                      : user.status === 'busy'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                }`}
              />
            </div>
            <p className="text-sm text-gray-500 capitalize">{user.status}</p>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={loading}>
                  <Save size={16} />
                  Save
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <p className="text-gray-900 dark:text-white">{user.username}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Joined
                </label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {isOwnProfile && (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 size={16} />
                    Edit Profile
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserProfile;
