export const notFound = (req, res, next) => {

  res.status(404);

  next(new Error(`Route not found: ${req.originalUrl}`));

};


export const errorHandler = (err, req, res, next) => {

  let statusCode = res.statusCode === 200
    ? 500
    : res.statusCode;

  let message = err.message || "Internal Server Error";

  // Handle duplicate email errors from MongoDB
  if (err.code === 11000) {
    statusCode = 409;
    message = "A student with this email already exists";
  }

  res.status(statusCode).json({

    success: false,

    message,

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),

  });

};