export const saveJwt = (jwt) => {
    document.cookie = `jwt=${jwt}`;
}

export const getJwt = () => {
    const cookies = document.cookie;
    const jwtToken = cookies.split('; ').find(cookie => cookie.startsWith('jwt='))?.split('=')[1];
    return jwtToken;
}

export const clearJwt = () => {
    document.cookie = 'jwt='
}
