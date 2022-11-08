import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
  if (!(req.headers?.authorization?.split(' ')[0] === 'Bearer')) {
    return res.status(401).send({ message: 'No token provided!' });
  }
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
}

export default verifyToken;
