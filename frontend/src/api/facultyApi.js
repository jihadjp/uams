import client from './client';

export const getFaculty = (params) => client.get('/faculties', { params });
export const getFacultyById = (id) => client.get(`/faculties/${id}`);
export const createFaculty = (data) => client.post('/faculties', data);
export const updateFaculty = (id, data) => client.put(`/faculties/${id}`, data);
export const deleteFaculty = (id) => client.delete(`/faculties/${id}`);

export const getMyProfile = () => client.get('/faculties/me');

export const getMyCourses = (params) => client.get('/course-offerings', { params });

export const getDepartments = () => client.get('/departments');
