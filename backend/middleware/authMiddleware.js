import jwt from "jsonwebtoken";

import Student from "../models/student.js";

// AUTHENTICATION MIDDLEWARE

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,

        message: "Not authorized. Please log in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find authenticated user
    const student = await Student.findById(decoded.id).select(
      "+passwordChangedAt",
    );

    if (!student) {
      return res.status(401).json({
        success: false,

        message: "User account no longer exists.",
      });
    }

    // Check whether password was changed after token issuance
    if (student.passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(
        student.passwordChangedAt.getTime() / 1000,
      );

      if (decoded.iat <= passwordChangedTimestamp) {
        return res.status(401).json({
          success: false,

          message: "Your password has changed. Please log in again.",
        });
      }
    }

    // Attach user information to request
    req.student = student;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,

        message: "Invalid or expired authentication token.",
      });
    }

    next(error);
  }
};

// ADMIN AUTHORIZATION MIDDLEWARE

export const adminOnly = (req, res, next) => {
  // Check whether user is authenticated
  if (!req.student) {
    return res.status(401).json({
      success: false,

      message: "Authentication required.",
    });
  }

  // Check whether user is an administrator
  if (req.student.role !== "admin") {
    return res.status(403).json({
      success: false,

      message: "Access denied. Administrators only.",
    });
  }

  // Allow administrator to continue
  next();
};
