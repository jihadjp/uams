import client from './client';

export const loginApi = async (credentials) => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};

export const changePassword = (data) => client.put('/auth/change-password', data);

export const resetUserPassword = (userId) => client.post(`/auth/reset-password/${userId}`);
