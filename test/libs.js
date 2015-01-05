/**
 * Libs Test
 *
 */

var expect = require("chai").expect;

var libs = require("../libs");

describe("Libs", function () {
  describe("pwhash", function () {
    var pass = "password";
    var salt;
    var key;

    it("#generate", function (done) {
      libs.pwhash.generate(pass, function (err, _key, _salt) {
        expect(err).to.be.null;
        expect(_key).to.have.length(64);
        expect(_salt).to.have.length(64);

        key = _key;
        salt = _salt;

        done();
      });
    });

    it("#verify", function (done) {
      libs.pwhash.verify(key, salt, pass, function (err, result) {
        expect(err).to.be.null;
        expect(result).to.be.true;

        done();
      });
    });
  });
});
