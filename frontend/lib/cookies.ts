export const saveJwtCookie = (jwt: string) => {
  document.cookie = `jwt=${jwt}`;
};

export const getJwtCookie = () => {
  const cookies = document.cookie;
  const jwtToken = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith('jwt='))
    ?.split('=')[1];
  return jwtToken;
};

export const clearJwt = () => {
  document.cookie = 'jwt=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
