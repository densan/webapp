/**
 * Page Test
 *
 */

var request = require("supertest");

var app = require("../server");

describe("Pages", function (done) {
  it("Get top page (/)", function () {
    request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200, done);
  });

  it("Get auth page (/auth)", function (done) {
    request(app)
      .get("/auth")
      .expect("Location", /^https:\/\/www\.google\.com\/accounts\/o8\/ud/)
      .expect(302, done);
  });

  describe("authorized", function () {
    var agent = request.agent(app);

    before(function () {
      request(app)
        .get("/auth")
        .expect("Location", /^https:\/\/www\.google\.com\/accounts\/o8\/ud/)
        .expect(302, done);
    });
  });
});
