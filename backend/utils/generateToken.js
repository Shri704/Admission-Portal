// backend/utils/generateToken.js
import jwt from "jsonwebtoken";
import config from "../config/env.js";

/**
 * Generate a JWT for a user.
 * @param {String} id - MongoDB _id of the user
 * @param {String} role - Role of user ('student' | 'admin')
 */
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || "7d",
  });
};
