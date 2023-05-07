import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import User from '../models/User.js';

function withoutProperty(obj, property) {
  if (obj === null) {
    return null;
  }
  
  obj[property] = null;

  return obj;
}

export const checkAuth = async (req, res) => {
  console.log('Check auth');
  const user = await User.findById(req.user.userId);

  res.json(withoutProperty(user, 'password'));
};

export const signUp = async (req, res, next) => {
  console.log('Sign up');
  console.log(req.body);
  try {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
      throw new BadRequestError('please provide all values');
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new BadRequestError('Email already in use');
    }

    const user = await User.create({ email, password, first_name, last_name });
    const token = user.createJWT();

    res.status(201).json({
      user: withoutProperty(user, 'password'),
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  console.log('Sign in');

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Please provide all values');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnAuthenticatedError('The account does not exist');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError('The password is incorrect');
    }

    const token = user.createJWT();

    res.status(200).json({
      user: withoutProperty(user, 'password'),
      token,
    });
  } catch (err) {
    next(err);
  }
};
