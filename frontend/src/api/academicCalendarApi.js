import client from './client';

export const getCalendarBySemester = (semesterId) => client.get(`/academic-calendar/${semesterId}`);
export const saveCalendar = (semesterId, data) => client.post(`/academic-calendar/${semesterId}`, data);
