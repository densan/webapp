/**
 * Message Model
 *
 */

var mongoose = require("mongoose");

// Message スキーマの定義
/* 足りないプロパティを追加してください */
var schema = new mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

// id getter
var id = schema.virtual("id");
id.get(function () {
  return String(this._id);
});

// timestamp getter
var timestamp = schema.virtual("timestamp");
timestamp.get(function () {
  return this.created_at.getTime();
});

// 保存時の処理
schema.pre("save", function (next) {
  // update_at プロパティを現在時刻で更新する。
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Message", schema);
