import client from './client';

export const getMyClearance = () => client.get('/clearance/my');
