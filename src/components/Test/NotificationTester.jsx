// components/Test/NotificationTester.jsx
import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

export default function NotificationTester() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testNotification = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axiosClient.post('/api/test/notification');
      setResult({ success: true, data: res.data });
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axiosClient.post('/api/test/email');
      setResult({ success: true, data: res.data });
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  const testBulkNotifications = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axiosClient.post('/api/test/notifications/bulk');
      setResult({ success: true, data: res.data });
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Notification Testing</h3>
      
      <div className="space-y-3">
        <button
          onClick={testNotification}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Single Notification'}
        </button>

        <button
          onClick={testBulkNotifications}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Bulk Notifications (4 types)'}
        </button>

        <button
          onClick={testEmail}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Email System'}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded ${
          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result.success ? (
            <pre className="text-sm">{JSON.stringify(result.data, null, 2)}</pre>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}