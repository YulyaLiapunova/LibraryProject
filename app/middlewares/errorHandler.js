const errorHandler = (err, req, res, next) => {
  res.status(err.status || 400).send({
    error: "An error occurred",
    message: err.message,
  });
};

module.exports = errorHandler;
