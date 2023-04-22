import CustomAPIError from './CustomAPI.js';

export default class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message, 403);
  }
}
