import client from './client';

export const getMyTranscript = (studentId) => client.get(`/results/student/${studentId}/transcript`);
