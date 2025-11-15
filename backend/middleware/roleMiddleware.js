// backend/middleware/roleMiddleware.js

/**
 * Middleware for role-based access control.
 * Example: router.get('/admin/data', protect, authorize('admin'), handler);
 */

export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const role = req.user.role;

    if (!allowedRoles.includes(role)) {
      res.status(403);
      throw new Error(`Access denied for role: ${role}`);
    }

    next();
  };
