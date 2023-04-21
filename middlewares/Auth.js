import UnAuthenticatedError from '../errors/UnAuthenticated.js';
import jwt from 'jsonwebtoken';

const AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnAuthenticatedError('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      throw new UnAuthenticatedError('Authentication Invalid');
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default AuthMiddleware;
