import axios from 'axios';

const API_URL = '/api/trends';

export const trendsApi = {
  triggerCollection: async () => {
    const response = await axios.post(`${API_URL}/collect`);
    return response.data;
  },
  getTrends: async (params = {}) => {
    // Manually build search params to handle arrays like categoryIds=1&categoryIds=2
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    const response = await axios.get(`${API_URL}?${searchParams.toString()}`);
    return response.data;
  },
  getCollectionStatus: async () => {
    const response = await axios.get(`${API_URL}/collect/status`);
    return response.data;
  }
};
