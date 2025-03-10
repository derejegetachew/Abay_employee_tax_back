const dev = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (!res.headersSent) {
    res.status(statusCode).json({
      success: 0,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("Headers already sent:", err);
  }
};

const prod = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (!res.headersSent) {
    if (err.isOperational) {
      res.status(statusCode).json({
        success: 0,
        message: err.message,
      });
    } else {
      res.status(statusCode).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  } else {
    console.error("Headers already sent:", err);
  }
};

module.exports = (err, req, res, next) => {
  const env = process.env.running_environment || 'development';
  if (env === 'development') {
    dev(err, req, res, next);
  } else {
    prod(err, req, res, next);
  }
};