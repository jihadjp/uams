import client from './client';

export const getMyTranscript = (studentId) => client.get(`/results/student/${studentId}/transcript`);
export const getLiveResults = (studentId, semesterId) => client.get(`/results/live?studentId=${studentId}&semesterId=${semesterId}`);
