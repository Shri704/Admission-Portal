// backend/utils/responseHelper.js

/**
 * Send a standard success response
 */
export const successResponse = (res, message, data = null, code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a standard error response
 */
export const errorResponse = (res, message, code = 400, details = null) => {
  return res.status(code).json({
    success: false,
    message,
    details,
  });
};

/**
 * Example usage:
 * successResponse(res, "User created", user, 201);
 * errorResponse(res, "Invalid credentials", 401);
 */
