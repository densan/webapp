/**
 * Auth Route
 *
 */

var express = require("express");
var router = express.Router();

var models = require("../models");

var passport = require("passport");
var GoogleStrategy = require("passport-google").Strategy;
var config = require("config");

// passport の設定
passport.use(new GoogleStrategy(config.google, function (id, profile, done) {
  var user = {
    id: id,
    first_name: profile.name.givenName,
    last_name: profile.name.familyName,
    email: profile.emails[0].value
  };

  console.info(user);

  done(null, user);
}));

// user object -> id 変換
passport.serializeUser(function (user, done) {
  models.User.findOneAndUpdate({id: user.id}, {upsert: true}, function (err, user) {
    done(err, user.id);
  });
});

// id -> user object 変換
passport.deserializeUser(function (id, done) {
  models.User.findOne({id: id}).exec(done);
});

// 認証ページ
router.get("/", passport.authenticate("google"));

// 認証コールバックページ
router.get("/callback", passport.authenticate("google", {
  // 成功時のリダイレクトページ
  successRedirect: "/home",
  // 失敗時のリダイレクトページ
  failureRedirect: "/auth/fail"
}));

// 認証失敗ページ
router.get("/fail", function (req, res) {
  res.render("error", {
    message: "認証に失敗しました。"
  });
});

module.exports = router;
