import client from './client';

export const getMyTranscript = (studentId) => client.get(`/results/student/${studentId}/transcript`);
export const getLiveResults = (studentId, semesterId) => client.get(`/results/live?studentId=${studentId}&semesterId=${semesterId}`);
export const getOfferingResults = (offeringId) => client.get(`/results/offering/${offeringId}`);
export const getAcademicResults = (semesterId) => client.get(`/results/academic?semesterId=${semesterId}`);
export const getStudentStanding = () => client.get('/results/standing');
export const approveOfferingResults = (offeringId) => client.put(`/course-offerings/${offeringId}/approve-results`);
