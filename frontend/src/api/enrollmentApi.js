import client from './client';

export const getAvailableOfferings = (params) => client.get('/course-offerings', { params });

export const getMyEnrollments = (studentId, semesterId) => {
  const params = { studentId };
  if (semesterId) params.semesterId = semesterId;
  return client.get('/enrollments/my', { params });
};

export const registerCourse = (data) => client.post('/enrollments/register', data);

export const registerBulk = (data) => client.post('/enrollments/register-bulk', data);

export const dropCourse = (id) => client.post(`/enrollments/${id}/drop`);
