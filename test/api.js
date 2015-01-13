/**
 * API Test
 *
 */

var request = require("supertest");
var expect = require("chai").expect;

var models = require("../models");

var app = require("../server");

describe("API", function () {
  before(function (done) {
    models.User.create([{
      id: "test_account",
      first_name: "test",
      last_name: "account",
      email: "test@example.com",
      password: {
        key: "testtest"
      }
    }, {
      id: "hoge_piyo",
      first_name: "hoge",
      last_name: "piyo",
      email: "hoge@example.com",
      password: {
        key: "piyopiyo"
      }
    }]).then(function (user) {
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
    var agent2 = request.agent(app);
    var message_id;
    var message_id2;
    var post_size = 0;

    before(function (done) {
      agent
        .post("/auth/password")
        .send({email: "test@example.com", pass: "testtest"})
        .expect(302, done);
    });
    before(function (done) {
      agent2
        .post("/auth/password")
        .send({email: "hoge@example.com", pass: "piyopiyo"})
        .expect(302, done);
    });

    it("POST /message", function (done) {
      agent
        .post("/message")
        .send({data: "メッセージ"})
        .expect("Content-Type", /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ok");
          expect(res.body).to.have.property("id").to.be.an("string");
          message_id = res.body.id;

          done();
        });
    });
    it("POST /message (another user)", function (done) {
      agent2
        .post("/message")
        .send({data: "コメント"})
        .expect("Content-Type", /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ok");
          expect(res.body).to.have.property("id").to.be.an("string");
          message_id2 = res.body.id;

          done();
        });
    });
    it("POST /message (Bad Request 1)", function (done) {
      agent
        .post("/message")
        .send({})
        .expect("Content-Type", /application\/json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ng");
          expect(res.body).to.have.property("message", "不正なリクエストです。");
          done();
        });
    });
    it("POST /message (Bad Request 2)", function (done) {
      agent
        .post("/message")
        .send({data: ""})
        .expect("Content-Type", /application\/json/)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ng");
          expect(res.body).to.have.property("message", "不正なリクエストです。");
          done();
        });
    });

    it("GET /messsage", function (done) {
      agent
        .get("/message")
        .expect("Content-Type", /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ok");
          expect(res.body).to.have.property("posts").to.be.an("array");

          var post = res.body.posts.filter(function (post) {
            return post.id === message_id;
          })[0];
          post_size = res.body.posts.length;

          expect(post).to.have.property("id", message_id);
          expect(post).to.have.property("data", "メッセージ");
          var now = Date.now();
          expect(post).to.have.property("timestamp").to.be.within(now - 2000, now);
          expect(post).to.have.property("user").to.be.an("object");

          var user = post.user;
          expect(user).to.have.property("name", "test account");

          done();
        });
    });

    it("DELETE /message/:id", function (done) {
      agent
        .delete("/message/" + message_id)
        .expect("Content-Type", /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ok");
          expect(res.body).to.have.property("id", message_id);

          agent
            .get("/message")
            .end(function (err, res) {
              if (err) {
                return done(err);
              }

              expect(res.body.posts).to.have.length(post_size - 1);
              done();
            });
        });
    });
    it("DELTE /mesasge/:id (message already deleted)", function (done) {
      agent
        .delete("/message/" + message_id)
        .expect("Content-Type", /application\/json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ok");
          expect(res.body).to.have.property("id", message_id);

          done();
        });
    });
    it("DELETE /message/:id (Bad Request)", function (done) {
      agent
        .delete("/message/" + message_id2)
        .expect("Content-Type", /application\/json/)
        .expect(403)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res.body).to.have.property("status", "ng");
          expect(res.body).to.have.property("message", "権限がありません。");

          done();
        });
    });

    after(function (done) {
      models.User.find([{
        id: "test_account"
      }, {
        id: "hoge_piyo"
      }]).exec().then(function (users) {
        var condition = users.map(function (user) {
          return {user: user};
        });
        return models.Message.remove(condition);
      }).then(function () {
        done();
      }, done);
    });
  });

  after(function (done) {
    models.User.remove([{
      id: "test_account"
    }, {
      id: "hoge_piyo"
    }]).exec(done);
  });
});
