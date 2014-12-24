/**
 * Home Route
 *
 */

var express = require("express");
var router = express.Router();

var models = require("../models");

// /home のルート
router.get("/", function (req, res) {
  // views/home.html をテンプレートとして読み込んで返す
  res.render("home");
});

module.exports = router;
