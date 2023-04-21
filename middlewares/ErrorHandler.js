const ErrorHandlerMiddleware = (err, req, res, next) => {
  const defaultErr = {
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong, try again later',
  };

  if (err.name === 'ValidationError') {
    defaultErr.statusCode = 400;
    defaultErr.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
  }

  if (err.code === 11000) {
    defaultErr.statusCode = 400;
    defaultErr.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  res.status(defaultErr.statusCode).json({ msg: defaultErr.msg });
};

export default ErrorHandlerMiddleware;
