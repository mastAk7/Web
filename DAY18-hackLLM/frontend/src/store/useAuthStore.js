import create from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      // ignore network errors
    }
    set({ user: null });
  }
}));

export default useAuthStore;
