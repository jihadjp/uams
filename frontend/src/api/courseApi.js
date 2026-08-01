import client from './client';

export const getCourses = (params) => client.get('/courses', { params });
export const getCourseById = (id) => client.get(`/courses/${id}`);
export const createCourse = (data) => client.post('/courses', data);
export const updateCourse = (id, data) => client.put(`/courses/${id}`, data);
export const deleteCourse = (id) => client.delete(`/courses/${id}`);
