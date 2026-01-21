import axios from 'axios';

export const newsletterApi = {
  clearActiveDraft: async () => {
    const response = await axios.post('/api/newsletters/active-draft/clear');
    return response.data;
  },
  
  getActiveDraft: async () => {
      const response = await axios.get('/api/newsletters/active-draft');
      return response.data;
  },

  toggleItem: async (itemId) => {
      const response = await axios.post('/api/newsletters/active-draft/toggle-item', { item_id: itemId });
      return response.data;
  }
};
