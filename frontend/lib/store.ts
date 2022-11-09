import { deleteUser, getUserSession, loginUser, logoutUser } from 'api';
import create from 'zustand';
import { User } from './types';

interface UserStore {
  user: User;
  updateUser: (token: string) => any;
  loginUser: (username: string, password: string, token: string) => any;
  logoutUser: () => any;
  deleteUser: () => any;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: { username: '', loginState: false },
  loginUser: async (username: string, password: string, token: string) => {
    try {
      const res = await loginUser(username, password, token);
      if (res.token) {
        set((state) => ({ user: { ...state.user, username, loginState: true } }));
      }
      return res;
    } catch (err: any) {
      return { error: 'Failed to login user' };
    }
  },
  updateUser: async () => {
    try {
      const user = await getUserSession();

      if (user.username) {
        set((state) => ({
          user: { ...state.user, username: user.username, loginState: true },
        }));
      }
      return get().user;
    } catch (err) {
      console.error(err);
      return { error: 'An error occured while updating user' };
    }
  },
  logoutUser: async () => {
    try {
      const res = await logoutUser();

      if (res) {
        set((state) => ({ user: { ...state.user, username: '', loginState: false } }));
      }
      return res;
    } catch (err) {
      console.error(err);
      return { error: 'An error occured while logging out' };
    }
  },
  deleteUser: async () => {
    try {
      const res = await deleteUser()
      if (res) {
        set((state) => ({ user: { ...state.user, username: '', loginState: false } }));
      }

      return res;
    } catch (err) {
      console.log(err);
      return { error: 'An error occured while deleting account' };
    }
  },
}));

export default useUserStore;
