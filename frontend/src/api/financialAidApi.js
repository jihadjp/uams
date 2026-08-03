import client from './client';

// Student Endpoints
export const getActiveCirculars = () => client.get('/financial-aid/circulars');
export const getCircularById = (id) => client.get(`/financial-aid/circulars/${id}`);
export const applyForAid = (data) => client.post('/financial-aid/apply', data);
export const getMyApplications = () => client.get('/financial-aid/my-applications');

// Admin Endpoints
export const getAllCirculars = () => client.get('/financial-aid/admin/circulars');
export const createCircular = (data) => client.post('/financial-aid/admin/circulars', data);
export const updateCircular = (id, data) => client.put(`/financial-aid/admin/circulars/${id}`, data);
export const deleteCircular = (id) => client.delete(`/financial-aid/admin/circulars/${id}`);
export const getAllApplications = () => client.get('/financial-aid/admin/applications');
export const updateApplicationStatus = (id, data) => client.put(`/financial-aid/admin/applications/${id}/status`, data);
