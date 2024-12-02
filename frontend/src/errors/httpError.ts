class HttpError extends Error {
  constructor(message?: string) {
    super(message);
    // change the default error's name (Error) to the class name that is being instantiated
    this.name = this.constructor.name;
  }
}

/** status code: 401 */
export class UnauthorizedError extends HttpError {}

/** status code: 409 */

export class ConflictError extends HttpError {}
