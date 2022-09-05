import { useState, createContext, useEffect, useContext } from 'react';
import { URL_USER_SESSION, URL_USER_LOGIN, URL_USER_LOGOUT } from '../configs';
import axios from 'axios';
import { STATUS_CODE_LOGGED_OUT } from '../constants';

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

const SessionProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const jwt = getJwtCookie();
    updateSession(jwt);
  }, []);

  const updateSession = async (jwt) => {
    const res = await axios.get(URL_USER_SESSION, {
      headers: {
        Authorization: 'Bearer ' + jwt,
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
    const res = await axios.post(URL_USER_LOGIN, { username, password });
    if (res.data.token) {
      saveJwtCookie(res.data.token);
      updateSession(res.data.token);
    }
    return res;
  };

  const logout = async (username) => {
    try {
      const res = await axios.get(URL_USER_LOGOUT, {
        headers: { username: username },
      });
      if (res.status === STATUS_CODE_LOGGED_OUT) {
        clearJwt();
        setUser();
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SessionContext.Provider value={{ user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider
