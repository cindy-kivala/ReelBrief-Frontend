// api/notificationAPI.js
import axiosClient from './axiosClient';

const notificationAPI = {
  // Get all notifications for current user
  getAll: async (page = 1, limit = 20) => {
    const res = await axiosClient.get(`/api/notifications?page=${page}&limit=${limit}`);
    return res.data;
  },

  // Get unread notifications
  getUnread: async () => {
    const res = await axiosClient.get('/api/notifications/unread');
    return res.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const res = await axiosClient.patch(`/api/notifications/${notificationId}/read`);
    return res.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const res = await axiosClient.patch('/api/notifications/read-all');
    return res.data;
  },

  // Get notification preferences
  getPreferences: async () => {
    const res = await axiosClient.get('/api/notifications/preferences');
    return res.data;
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    const res = await axiosClient.put('/api/notifications/preferences', preferences);
    return res.data;
  }
};

export default notificationAPI;