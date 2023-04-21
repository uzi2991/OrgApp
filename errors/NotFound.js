import CustomAPIError from "./CustomAPI.js";

export default class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message, 404);
  }
}
