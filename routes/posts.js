var express = require("express");
var router = express.Router();
const { appError } = require("../errorHandle");
const { handleErrorAsync } = require("../middleware");
const Post = require("../models/post.model");

router.get("/", async function (req, res, next) {
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
  const q =
    req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
  const post = await Post.find(q)
    .populate({
      path: "user",
      select: "name photo ",
    })
    .sort(timeSort);
  // res.send('respond with a resource');
  res.status(200).json({
    post,
  });
});

router.post(
  "/",
  handleErrorAsync(async function (req, res, next) {
    // console.log("req.body", req.body);
    // query params
    if (req.body.content == undefined) {
      return next(appError(400, "你沒有填寫 content 資料", next));
    }

    const newPost = await Post.create(req.body);
    // res.send('<h1>1234</h1>');
    res.status(200).json({
      status: "success",
      post: newPost,
    });
  })
);

module.exports = router;
