/**
 * User Route
 *
 */

var express = require("express");
var router = express.Router();

var validator = require("validator");

var libs = require("../libs");
var models = require("../models");

// GET /user のルート
router.get("/", function (req, res) {
  // views/home.html をテンプレートとして読み込んで返す
  res.render("user");
});

// POST /user のルート
router.post("/", function (req, res) {
  var password = req.body.pass;
  var confirm = req.body.pass_confirm;

  // validate
  if (! validator.isLength(password, 8)) {
    return res.status(400).json({
      status: "ng",
      message: "パスワードは8文字以上で設定してください。"
    });
  }

  if (password !== confirm) {
    return res.status(400).json({
      status: "ng",
      message: "確認用のパスワードが間違っています。"
    });
  }

  libs.pwhash.generate(password, function (err, password, salt) {
    var user = req.user.toJSON();
    user.password = {
      key: password,
      salt: salt
    };

    models.User.findOneAndUpdate({
      id: req.user.id
    }, user).exec(function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: "ng",
          message: "database error"
        });
      }

      if (req.xhr) {
        res.json({
          status: "ok"
        });
      } else {
        // GET /user へリダイレクト
        res.redirect("/user");
      }
    });
  });
});

module.exports = router;
