// components/User/EmailPreferences.jsx
import { useState, useEffect } from 'react';
import notificationAPI from '../../api/notificationAPI';
import { useAuth } from '../../context/AuthContext';

export default function EmailPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    email_project_updates: true,
    email_payment_notifications: true,
    email_deliverable_updates: true,
    email_marketing: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const data = await notificationAPI.getPreferences();
      setPreferences(data.preferences || preferences);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await notificationAPI.updatePreferences(preferences);
      // Show success message
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Project Updates</h4>
            <p className="text-sm text-gray-500">Get notified about project assignments and updates</p>
          </div>
          <button
            onClick={() => handleToggle('email_project_updates')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              preferences.email_project_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.email_project_updates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Payment Notifications</h4>
            <p className="text-sm text-gray-500">Receive payment confirmations and invoices</p>
          </div>
          <button
            onClick={() => handleToggle('email_payment_notifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              preferences.email_payment_notifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.email_payment_notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Deliverable Updates</h4>
            <p className="text-sm text-gray-500">Notifications for deliverable approvals and feedback</p>
          </div>
          <button
            onClick={() => handleToggle('email_deliverable_updates')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              preferences.email_deliverable_updates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                preferences.email_deliverable_updates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={savePreferences}
        disabled={saving}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}