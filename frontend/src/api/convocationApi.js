import client from './client';

export const applyForConvocation = (data) => client.post('/convocation/apply', data);
export const getMyConvocationApplications = () => client.get('/convocation/my-applications');
export const getAllConvocationApplications = () => client.get('/convocation/all');
export const updateConvocationStatus = (id, data) => client.put(`/convocation/${id}/status`, data);
export const updateConvocationApplication = (id, data) => client.put(`/convocation/${id}`, data);
