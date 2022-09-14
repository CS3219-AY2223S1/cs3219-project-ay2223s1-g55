import axios from 'axios';
import create from 'zustand';
import { URL_USER_LOGIN, URL_USER_LOGOUT, URL_USER_SESSION, URL_USER_SVC } from './configs';
import { STATUS_CODE_LOGGED_OUT } from './constants';

interface User {
  username: string;
  loginState: boolean;
}

interface UserStore {
  user: User;
  updateUser: (token: string) => void;
  loginUser: (username: string, password: string, token: string) => any;
  logoutUser: (token: string) => any;
  deleteUser: (token: string) => any;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: { username: '', loginState: false },
  loginUser: async (username: string, password: string, token: string) => {
    const res = await axios.post(URL_USER_LOGIN, { username, password, token });
    if (res.data.token) {
      set({ user: { username: username, loginState: true } });
    }
    return res;
  },
  updateUser: async (token: string) => {
    const res = await axios.get(URL_USER_SESSION, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.username) {
      set({ user: { username: res.data.username, loginState: true } });
    }
  },
  logoutUser: async (token: string) => {
    try {
      const res = await axios.post(URL_USER_LOGOUT, { token });

      if (res.status === STATUS_CODE_LOGGED_OUT) {
        set({ user: { username: '', loginState: false } });
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  deleteUser: async (token: string) => {
    try {
      const res = await axios.delete(URL_USER_SVC, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        set({ user: { username: '', loginState: false } });
      }

      return res;
    } catch (err) {
      console.log(err);
    }
  },
}));