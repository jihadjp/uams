import client from './client';

export const getRegistrars = () => client.get('/registrars');
export const createRegistrar = (data) => client.post('/registrars', data);
export const updateRegistrar = (id, data) => client.put(`/registrars/${id}`, data);
export const deleteRegistrar = (id) => client.delete(`/registrars/${id}`);
