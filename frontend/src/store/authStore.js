import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
        localStorage.setItem('token', token);
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },

      setPasswordChanged: () => {
        set((state) => ({
          user: { ...state.user, mustChangePassword: false }
        }));
      }
    }),
    {
      name: 'uams-auth-storage',
    }
  )
);
