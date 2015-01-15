/**
 * Message Route
 *
 */

var express = require("express");
var router = express.Router();

var models = require("../models");

// 認証確認
router.use(function (req, res, next) {
  if (! req.user) {
    return res.redirect(302, "/auth");
  }
  next();
});

/* message router の実装 */

module.exports = router;
