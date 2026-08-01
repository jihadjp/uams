import client from './client';

export const getPrograms = (params) => client.get('/programs', { params });

export const getProgramById = (id) => client.get(`/programs/${id}`);

export const createProgram = (data) => client.post('/programs', data);

export const updateProgram = (id, data) => client.put(`/programs/${id}`, data);

export const deleteProgram = (id) => client.delete(`/programs/${id}`);
