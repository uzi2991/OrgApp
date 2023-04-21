import CustomAPIError from "./CustomAPI.js";

export default class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message, 400);
  }
}
