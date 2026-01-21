import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3000/api';

export const getSubscribers = async () => {
  const response = await axios.get(`${API_URL}/subscribers`);
  return response.data;
};

export const getSubscriber = async (id) => {
  const response = await axios.get(`${API_URL}/subscribers/${id}`);
  return response.data;
};

export const createSubscriber = async (subscriberData) => {
  const response = await axios.post(`${API_URL}/subscribers`, subscriberData);
  return response.data;
};

export const updateSubscriber = async (id, subscriberData) => {
  const response = await axios.put(`${API_URL}/subscribers/${id}`, subscriberData);
  return response.data;
};

export const unsubscribeSubscriber = async (uuid) => {
  const response = await axios.post(`${API_URL}/subscribers/unsubscribe/${uuid}`);
  return response.data;
};

export const syncSubscribers = async () => {
  const response = await axios.post(`${API_URL}/subscribers/sync`);
  return response.data;
};
