import client from './client';

export const getCourseOfferings = (params) => client.get('/course-offerings', { params });
export const getCourseOfferingById = (id) => client.get(`/course-offerings/${id}`);
export const createCourseOffering = (data) => client.post('/course-offerings', data);
export const updateCourseOffering = (id, data) => client.put(`/course-offerings/${id}`, data);
export const deleteCourseOffering = (id) => client.delete(`/course-offerings/${id}`);
export const approveCourseResults = (id) => client.put(`/course-offerings/${id}/approve-results`);
