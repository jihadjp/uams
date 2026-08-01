import client from './client';

export const getSemesters = (params) => client.get('/semesters', { params });
export const getActiveSemester = () => client.get('/semesters/active');
export const createSemester = (data) => client.post('/semesters', data);
export const updateSemester = (id, data) => client.put(`/semesters/${id}`, data);
export const deleteSemester = (id) => client.delete(`/semesters/${id}`);
export const setActiveSemester = (id) => client.put(`/semesters/${id}/activate`);
export const updateSemesterStatus = (id, status) => client.put(`/semesters/${id}/status?status=${status}`);
