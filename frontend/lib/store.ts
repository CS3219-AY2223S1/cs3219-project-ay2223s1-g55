import axios from 'axios';
import create from 'zustand';
import { URL_USER_LOGIN, URL_USER_LOGOUT, URL_USER_SESSION, URL_USER_SVC } from './configs';
import { STATUS_CODE_LOGGED_OUT } from './constants';

interface User {
  username: string;
  token: string;
}

interface UserStore {
  user: User;
  updateUser: (token: string) => any;
  loginUser: (username: string, password: string) => any;
  logoutUser: () => any;
  deleteUser: () => any;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: { username: '', token: '' },
  loginUser: async (username: string, password: string) => {
    const { user } = get();
    const currToken = user.token;
    const res = await axios.post(URL_USER_LOGIN, { username, password, currToken });
    if (res.data.token) {
      set({ user: { username: username, token: res.data.token } });
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
      set({ user: { username: res.data.username, token: res.data.token } });
    }
  },
  logoutUser: async () => {
    try {
      const { user } = get();
      const token = user.token;
      const res = await axios.post(URL_USER_LOGOUT, { token });

      if (res.status === STATUS_CODE_LOGGED_OUT) {
        set({ user: { username: '', token: '' } });
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  },
  deleteUser: async () => {
    try {
      const { user } = get();
      const token = user.token;
      const res = await axios.delete(URL_USER_SVC, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        set({ user: { username: '', token: '' } });
      }

      return res;
    } catch (err) {
      console.log(err);
    }
  },
}));
