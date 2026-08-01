import client from './client';

export const getAdminStats = () => client.get('/admin/dashboard/stats');
export const getFacultyOverview = () => client.get('/faculty/dashboard/overview');
export const getStudentSummary = () => client.get('/student/dashboard/summary');
export const getRecentNotices = (size = 5) => client.get(`/notices?size=${size}`);
