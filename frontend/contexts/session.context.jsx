import { useState, createContext, useEffect, useContext } from 'react';
import {
  URL_USER_SESSION,
  URL_USER_LOGIN,
  URL_USER_LOGOUT,
  URL_MATCHING_MATCH,
} from '@/lib/configs';
import axios from 'axios';
import { STATUS_CODE_LOGGED_OUT } from '@/lib/constants';

const saveJwtCookie = (jwt) => {
  document.cookie = `jwt=${jwt}`;
};

const getJwtCookie = () => {
  const cookies = document.cookie;
  const jwtToken = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith('jwt='))
    ?.split('=')[1];
  return jwtToken;
};

const clearJwt = () => {
  document.cookie = 'jwt=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

function SessionProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const jwt = getJwtCookie();
    updateSession(jwt);
  }, []);

  const updateSession = async (jwt) => {
    const res = await axios.get(URL_USER_SESSION, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (res.data.username) {
      setUser({
        username: res.data.username,
        _id: res.data._id,
      });
    }
  };

  const login = async (username, password) => {
    const currToken = getJwtCookie();
    const res = await axios.post(URL_USER_LOGIN, { username, password, currToken });
    if (res.data.token) {
      saveJwtCookie(res.data.token);
      updateSession(res.data.token);
    }
    return res;
  };

  const logout = async () => {
    try {
      const token = getJwtCookie();
      const res = await axios.post(URL_USER_LOGOUT, { token });

      if (res.status === STATUS_CODE_LOGGED_OUT) {
        clearJwt();
        setUser();
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  };

  const deleteUser = async () => {
    try {
      const token = getJwtCookie();
      const res = await axios.delete(URL_USER_SVC, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        clearJwt();
        setUser();
      }

      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const sendMatchRequest = async (username, difficulty, roomSocketID) => {
    console.log('sendMatchRequest called with ', username, difficulty, roomSocketID);
    try {
      const res = await axios.get(URL_MATCHING_MATCH, {
        // username,
        // difficulty,
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
      console.log(err.response);
      console.log('error message is: ', err.response.data.message);
      console.log(err.message);
      throw err;
    }
  };

  return (
    <SessionContext.Provider value={{ user, login, logout, deleteUser, sendMatchRequest }}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;
