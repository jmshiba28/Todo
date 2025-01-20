import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { ArrowLeft, Bell, Moon, User, Shield, Trash2 } from 'lucide-react';
import { axiosInstance } from '../../api/axios';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    dueDateReminder: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
  };
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      dueDateReminder: true,
    },
    appearance: {
      theme: 'system',
      compactMode: false,
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/change-password', passwordForm);
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await axiosInstance.delete('/auth/delete-account');
        dispatch(logout());
        navigate('/login');
        toast.success('Account deleted successfully');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await axiosInstance.put('/user/settings', newSettings);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <User className="mr-2" size={24} />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username}
                  disabled
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-gray-300"
                />
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Bell className="mr-2" size={24} />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={e => 
                      updateSettings({
                        notifications: { ...settings.notifications, email: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={e => 
                      updateSettings({
                        notifications: { ...settings.notifications, push: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Moon className="mr-2" size={24} />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Theme
                </label>
                <select
                  value={settings.appearance.theme}
                  onChange={e => 
                    updateSettings({
                      appearance: { ...settings.appearance, theme: e.target.value as 'light' | 'dark' | 'system' }
                    })
                  }
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-gray-300"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Compact Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appearance.compactMode}
                    onChange={e => 
                      updateSettings({
                        appearance: { ...settings.appearance, compactMode: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Shield className="mr-2" size={24} />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-gray-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Trash2 className="mr-2 text-red-500" size={24} />
              <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Delete Account
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;