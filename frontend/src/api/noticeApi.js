import client from './client';

export const getNotices = (role) => client.get('/notices/my');
export const getAllNotices = (params) => client.get('/notices', { params });
export const getNoticeById = (id) => client.get(`/notices/${id}`);
export const createNotice = (data) => client.post('/notices', data);
export const updateNotice = (id, data) => client.put(`/notices/${id}`, data);
export const deleteNotice = (id) => client.delete(`/notices/${id}`);
export const incrementView = (id) => client.put(`/notices/${id}/view`);
