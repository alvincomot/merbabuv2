const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    status_code: statusCode,
    payload: data,
    message: message,
  });
};

module.exports = response;