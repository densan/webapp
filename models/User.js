/**
 * User Model
 *
 */

var mongoose = require("mongoose");

// User スキーマの定義
var schema = new mongoose.Schema({
  id: {
    type: String,
    index: {unique: true},
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: {unique: true},
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// 保存時の処理
schema.pre("save", function (next) {
  // update_at プロパティを現在時刻で更新する。
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("User", schema);
