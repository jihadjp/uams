import client from './client';

export const requestDocument = (data) => client.post('/documents/request', data);
export const getMyRequests = () => client.get('/documents/my-requests');
export const getAllRequests = () => client.get('/documents');
export const updateRequestStatus = (id, data) => client.put(`/documents/${id}/status`, data);
