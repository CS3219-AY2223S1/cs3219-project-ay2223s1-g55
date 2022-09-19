import axios from 'axios';
import create from 'zustand';
import {
  URL_USER_LOGIN,
  URL_USER_LOGOUT,
  URL_USER_SESSION,
  URL_USER_SVC,
  URL_MATCHING_MATCH,
} from './configs';
import { STATUS_CODE_LOGGED_OUT, STATUS_CODE_LOGIN_FAILED } from './constants';
import { User } from './types';

interface UserStore {
  user: User;
  updateUser: (token: string) => void;
  loginUser: (username: string, password: string, token: string) => any;
  logoutUser: (token: string) => any;
  deleteUser: (token: string) => any;
  sendMatchRequest: (username: string, difficulty: string, roomSocketID: string) => any;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: { username: '', loginState: false },
  loginUser: async (username: string, password: string, token: string) => {
    try {
      const res = await axios.post(URL_USER_LOGIN, { username, password, token });
      if (res.data.token) {
        set({ user: { username, loginState: true } });
      }
      return res;
    } catch (err: any) {
      if (err.response.status === STATUS_CODE_LOGIN_FAILED) {
        return { error: 'Failed to login user' };
      }
      return { error: 'Please try again later' };
    }
  },
  updateUser: async (token: string) => {
    try {
      const res = await axios.get(URL_USER_SESSION, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.username) {
        set({ user: { username: res.data.username, loginState: true } });
      }
    } catch (err) {
      console.error(err);
      return { error: 'An error occured while updating user' };
    }
  },
  logoutUser: async (token: string) => {
    try {
      const res = await axios.post(URL_USER_LOGOUT, { token });

      if (res.status === STATUS_CODE_LOGGED_OUT) {
        set({ user: { username: '', loginState: false } });
      }
      return res;
    } catch (err) {
      console.error(err);
      return { error: 'An error occured while logging out' };
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
      return { error: 'An error occured while deleting account' };
    }
  },
  sendMatchRequest: async (username: string, difficulty: string, roomSocketID: string) => {
    console.log('sendMatchRequest called with ', username, difficulty, roomSocketID);
    try {
      const res = await axios.get(URL_MATCHING_MATCH, {
        headers: {
          username,
          difficulty,
          roomSocketID,
        },
      });
      if (res.status === 200 || res.status === 201) {
        console.log('match request sent');
        // contains json of mongodbID, username, difficulty, createdAt, message
        return res;
      }
      if (res.status === 400 || res.status === 404) {
        console.log('match request failed');
        return res;
      }
      console.log('match request failed');
      return res;
    } catch (err) {
      console.log(err);
      console.log('An error occured when sending Match Request');
      throw err;
    }
  },
}));

export default useUserStore;
