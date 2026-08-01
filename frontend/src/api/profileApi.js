import client from './client';

export const getMyProfile = () => client.get('/profile/me');
export const updateProfile = (data) => client.put('/profile/update', data);
export const uploadProfileImage = (formData) => client.post('/profile/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const changePassword = (data) => client.put('/profile/change-password', data);
