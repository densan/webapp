/**
 * API Test
 *
 */

var request = require("supertest");
var expect = require("chai").expect;

var models = require("../models");
var libs = require("../libs");

var app = require("../server");

describe("API", function () {
  before(function (done) {
    models.User.create({
      id: "test_account",
      first_name: "test",
      last_name: "account",
      email: "test@example.com",
      password: {
        key: "testtest"
      }
    }).then(function (user) {
      user = user.toJSON();

      expect(user).to.have.property("id", "test_account");
      expect(user).to.have.property("first_name", "test");
      expect(user).to.have.property("last_name", "account");
      expect(user).to.have.property("email", "test@example.com");
      expect(user).to.have.property("password").to.be.an("object");
      expect(user.password).to.have.property("key").to.have.length(64);
      expect(user.password).to.have.property("salt").to.have.length(64);

      done();
    }, done);
  });

  describe("Auth API", function () {
    var agent = request.agent(app);

    it("POST /auth/password", function (done) {
      agent
        .post("/auth/password")
        .send({
          email: "test@example.com",
          pass: "testtest"
        })
        .expect("Location", /\/home$/)
        .expect(302, done);
    });

    it("GET /auth/logout", function (done) {
      agent
        .get("/auth/logout")
        .expect("Location", /\/$/)
        .expect(302, done);
    });
  });

  describe("User API", function () {
    var agent = request.agent(app);

    before(function (done) {
      agent
        .post("/auth/password")
        .send({email: "test@example.com", pass: "testtest"})
        .expect(302, done);
    });

    it("POST /user (Change password)", function (done) {
      agent
        .post("/user")
        .send({pass: "piyopiyo", pass_confirm: "piyopiyo"})
        .expect("Location", /\/user$/)
        .expect(302, done);
    });

    after(function (done) {
      console.log("a");
      models.User.findOne({
        id: "test_account"
      }).exec().then(function (user) {
        return user.updatePassword("testtest");
      }).then(function () {
        done();
      }, done);
    });
  });

  describe("Message API", function () {
    var agent = request.agent(app);

    before(function (done) {
      agent
        .post("/auth/password")
        .send({email: "test@example.com", pass: "testtest"})
        .expect(302, done);
    });

    it.skip("POST /message", function (done) {
      agent
        .post("/message")
        .send({data: "メッセージ"})
        .expect("Content-Type", "application/json")
        .expect(200, done);
    });
    it("POST /message (Bad Request 1)");
    it("POST /message (Bad Request 2)");
  });

  after(function (done) {
    models.User.remove({
      id: "test_account"
    }).exec(done);
  });
});
