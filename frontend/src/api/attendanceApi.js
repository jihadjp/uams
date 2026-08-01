import client from './client';

export const getStudentsForOffering = (offeringId) => client.get('/enrollments', { params: { offeringId, size: 1000 } });

export const getAttendanceForDate = (offeringId, date) => client.get(`/attendance/offering/${offeringId}`, { params: { date } });

export const getMyAttendance = (studentId) => client.get('/attendance/my', { params: { studentId } });

export const markAttendance = (data) => client.post('/attendance/mark', data);
