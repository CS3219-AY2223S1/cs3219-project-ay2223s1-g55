import { useState, createContext, useEffect, useContext } from "react";
import { URL_USER_SESSION, URL_USER_LOGIN } from "../configs";
import axios from 'axios';

const saveJwtCookie = (jwt) => {
    document.cookie = `jwt=${jwt}`;
}

const getJwtCookie = () => {
    const cookies = document.cookie;
    const jwtToken = cookies.split('; ').find(cookie => cookie.startsWith('jwt='))?.split('=')[1];
    return jwtToken;
}

const clearJwt = () => {
    document.cookie = 'jwt='
}

const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

const SessionProvider = ({ children }) => {
    const [user, setUser] = useState()

    useEffect(() => {
        const jwt = getJwtCookie();
        updateSession(jwt);
    }, [])

    const updateSession = async (jwt) => {
        const res = await axios.get(URL_USER_SESSION, { 
            headers: {
                Authorization: 'Bearer ' + jwt
            }
        });

        if (res.data.username) {
            setUser({
                username: res.data.username,
                _id: res.data._id
            });
        }
    }

    const login = async (username, password) => {
        const res = await axios.post(URL_USER_LOGIN, { username, password })
        if (res.data.token) {
            saveJwtCookie(res.data.token);
            updateSession(res.data.token);
        }
        return res;
    }

    return (
        <SessionContext.Provider value={{user, login}}>{children}</SessionContext.Provider>
    );
};

export default SessionProvider;
