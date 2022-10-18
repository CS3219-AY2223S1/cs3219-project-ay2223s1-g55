import jwt from 'jsonwebtoken';

export const decodeBearerToken = (req) => {
  if (!(req.headers?.authorization?.split(' ')[0] === 'Bearer')) {
    return;
  }

  const token = req.headers.authorization.split(' ')[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  if (!decode.username) {
    return;
  }

  return decode;
};
