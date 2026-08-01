import client from './client';

export const getDepartments = (params) => client.get('/departments', { params });
export const getDepartmentById = (id) => client.get(`/departments/${id}`);
export const createDepartment = (data) => client.post('/departments', data);
export const updateDepartment = (id, data) => client.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => client.delete(`/departments/${id}`);
export const getDepartmentFaculty = (id) => client.get(`/faculties`, { params: { departmentId: id } });
