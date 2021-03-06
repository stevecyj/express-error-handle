const { default: axios } = require("axios");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRouter = require("./routes/posts");
const app = express();
const {
  uncaughtException,
  unhandledRejection,
  errorResponder,
  error404,
} = require("./errorHandle");
// 程式出現重大錯誤時
process.on("uncaughtException", uncaughtException);

require("./connections");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// console.log(b);
app.use("/posts", postRouter);

const checkKeyword = function (req, res, next) {
  if (req.query.q) {
    next();
  } else {
    res.status(400).json({
      message: `您並未輸入關鍵字`,
    });
  }
};

const isLogin = function (req, res, next) {
  console.log("確認是否登入", req.query.q);
  next();
};

app.get("/search", checkKeyword, isLogin, function (req, res) {
  res.status(200).json({
    status: "success",
    keyword: `你搜尋到的是${req.query.q}`,
  });
});

// 404 錯誤
app.use(error404);

// express 錯誤處理
app.use(errorResponder);

// test 未捕捉到的 promise rejection
// axios.get("https://googlee.com").then((res) => {
//   console.log(res);
// });
// .catch((err) => {
//   console.log(err.message);
// });

// 未捕捉到的 catch
process.on("unhandledRejection", unhandledRejection);

// 監聽 port
const port = process.env.PORT || 3000;
app.listen(port);
