import { create } from 'zustand';
import client from '../api/client';

export const useNoticeStore = create((set, get) => ({
  unreadCount: 0,
  notices: [],

  fetchUnreadCount: async () => {
    try {
      // Fetch user specific notices
      const res = await client.get('/notices/my');
      const allNotices = res.data || [];

      // Logic: Unread = Notices not in 'readNotices' localStorage
      const savedReadNotices = JSON.parse(localStorage.getItem('readNotices') || '[]');
      const unread = allNotices.filter(n => !savedReadNotices.includes(n.id));

      set({ unreadCount: unread.length, notices: allNotices });
    } catch (err) {
      // Silent error for polling
    }
  },

  setUnreadCount: (count) => set({ unreadCount: count }),

  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

  refresh: () => get().fetchUnreadCount()
}));
