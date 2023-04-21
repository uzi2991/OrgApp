import CustomAPIError from './CustomAPI.js';

export default class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message, 401);
  }
}
