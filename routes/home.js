/**
 * Home Route
 *
 */

var express = require("express");
var router = express.Router();

var models = require("../models");

// 認証確認
router.use("/", function (req, res, next) {
  if (! req.user) {
    return res.redirect(302, "/auth");
  }
  next();
});

// GET /home のルート
router.get("/", function (req, res) {
  // views/home.html をテンプレートとして読み込んで返す
  res.render("home");
});

module.exports = router;
