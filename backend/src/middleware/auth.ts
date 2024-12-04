import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = async (req, res, next) => {
  console.log("Session:", req.session.userId); // Log the session to check its state

  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "User not authenticated."));
  }
};
