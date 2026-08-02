import client from './client';

export const submitEvaluation = (data) => client.post('/evaluations', data);
export const getEvaluationStatus = (semesterId) => client.get(`/evaluations/status/${semesterId}`);
export const getFacultyPerformance = (facultyId) => client.get(`/evaluations/faculty/${facultyId}`);
