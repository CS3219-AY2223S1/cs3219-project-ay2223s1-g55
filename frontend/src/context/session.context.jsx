import { useState, createContext, useEffect, useContext } from 'react';
import axios from 'axios';
import { URL_USER_SESSION, URL_USER_LOGIN, URL_USER_LOGOUT, URL_USER_SVC } from '../configs';
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

  const logout = async (username) => {
    try {
      const res = await axios.get(URL_USER_LOGOUT, {
        headers: { username },
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

  return (
    <SessionContext.Provider value={{ user, login, logout, deleteUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;
