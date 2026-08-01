import client from './client';

export const getMyFees = (studentId) => client.get(`/fees/student/${studentId}`);
