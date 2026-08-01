import client from './client';

export const getStudents = (params) => client.get('/students', { params });

export const getStudentById = (id) => client.get(`/students/${id}`);

export const createStudent = (data) => client.post('/students', data);

export const updateStudent = (id, data) => client.put(`/students/${id}`, data);

export const deleteStudent = (id) => client.delete(`/students/${id}`);

export const completeProfile = (data) => client.put('/students/profile/complete', null, { params: data });

export const updateClearance = (id, isCleared) => client.put(`/students/${id}/clearance?isCleared=${isCleared}`);

export const getPrograms = () => client.get('/programs');
