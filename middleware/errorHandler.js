const { constants } = require("../constants")
;
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  // console.error(err);
  switch (statusCode) {
    case constants.BAD_REQUEST:
      res.json({
        title: "Bad Request",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server error",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    default:
      console.log('error handler did not find any errors')
      break;
  }
}

module.exports = errorHandler;