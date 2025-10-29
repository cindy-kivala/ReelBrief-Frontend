/**
 * activityAPI.js
 * Owner: Caleb
 * Description: Handles API calls for fetching system activity logs.
 */
import axiosClient from './axiosClient';

const activityAPI = {
  async fetchRecent(limit = 20) {
    const response = await axiosClient.get(`/activity?limit=${limit}`);
    return response.data;
  },
};

export default activityAPI;
