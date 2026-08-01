import client from './client';

export const getExams = (offeringId) => client.get(`/exams/offering/${offeringId}`);

export const createExam = (data) => client.post('/exams', data);

export const deleteExam = (id) => client.delete(`/exams/${id}`);

export const getStudentsForMarks = (offeringId) => client.get('/enrollments', { params: { offeringId, size: 1000 } });

export const getExistingMarks = (examId) => client.get('/results', { params: { examId, size: 1000 } });

export const saveBulkMarks = (marksList) => client.post('/results/marks/bulk', marksList);

export const getFinalResultPreview = (offeringId) => client.get(`/results/preview/${offeringId}`);

export const publishFinalResults = (offeringId) => client.post(`/results/publish-final/${offeringId}`);
