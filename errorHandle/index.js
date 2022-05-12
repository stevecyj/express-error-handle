const uncaughtException = (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(`err name: ${err.name}`);
  console.error(`err message: ${err.message}`);
  console.error(`err stack: ${err.stack}`);
  process.exit(1);
};
const unhandledRejection = (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", reason);
  // 記錄於 log 上
};
const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
};
const errorResponder = (err, req, res, next) => {
  res.status(500).json({
    err: err.message,
  });
};
const error404 = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "無此路由資訊",
  });
};

module.exports = {
  uncaughtException,
  unhandledRejection,
  appError,
  errorResponder,
  error404,
};
