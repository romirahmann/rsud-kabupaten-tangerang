const success = (res, data) => {
  return res.status(200).json({
    status: true,
    data,
  });
};

const error = (res, message, code) => {
  return res.status(code).json({
    status: false,
    data: message,
  });
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log(err);
      return error(res, "Internal Server Error", 500);
    });
  };
};

module.exports = { success, error, catchAsync };
