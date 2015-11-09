var builder = require("..");

var assert = require("assert");
var sinon = require("sinon");

describe("builder", function () {
  it("builds empty directives", function () {
    var result = builder({
      directives: {}
    });

    assert.equal(result, "");
  });

  it("builds directives with camelCased keys", function () {
    var result = builder({
      directives: {
        whatThe: "heck",
        defaultSrc: "'self'",
        playtimeIsOver: ["star", "fox"]
      }
    });

    var split = result.split("; ").sort();

    assert.equal(split.length, 3);
    assert.equal(split[0], "default-src 'self'");
    assert.equal(split[1], "playtime-is-over star fox");
    assert.equal(split[2], "what-the heck");
  });

  it("builds directives with dash-separated keys", function () {
    var result = builder({
      directives: {
        "do-a": "barrel roll",
        "default-src": "'self'",
        "andross-has-ordered-us": ["to", "take", "you", "down"]
      }
    });

    var split = result.split("; ").sort();

    assert.equal(split.length, 3);
    assert.equal(split[0], "andross-has-ordered-us to take you down");
    assert.equal(split[1], "default-src 'self'");
    assert.equal(split[2], "do-a barrel roll");
  });

  it("builds directives with a mix of key types", function () {
    var result = builder({
      directives: {
        "hey-einstein": "i'm on your side",
        defaultSrc: "'self'",
        falco: ["lombardi"],
        crazy: [
          "a",
          function() { return "b" }
        ]
      }
    });

    var split = result.split("; ").sort();

    assert.equal(split.length, 4);
    assert.equal(split[0], "crazy a b");
    assert.equal(split[1], "default-src 'self'");
    assert.equal(split[2], "falco lombardi");
    assert.equal(split[3], "hey-einstein i'm on your side");
  });

  it("builds directives with empty values", function () {
    var result = builder({
      directives: {
        i: '',
        cant: [],
        lose: ['']
      }
    });

    var split = result.split("; ").sort();

    assert.equal(split.length, 3);
    assert.equal(split[0], "cant");
    assert.equal(split[1], "i");
    assert.equal(split[2], "lose");
  });

  it("calls function-values with default arguments", function() {
    var spy = sinon.spy();
    var result = builder({
      directives: {
        foo: [
          function() {
            spy();
            assert.equal(arguments.length, 0);
            return "bar";
          }
        ]
      }
    });

    assert.equal(spy.called, true);
    assert.equal(result, 'foo bar');
  });

  it("calls function-values with provided arguments and context", function() {
    var spy = sinon.spy();
    var result = builder({
      directives: {
        foo: [
          function(a, b) {
            spy();
            assert.equal(arguments.length, 2);
            assert.equal(this, 'foo');
            assert.equal(a, 'bar');
            assert.equal(b, 'baz')
            return "bar";
          }
        ]
      },
      arguments: ['bar', 'baz'],
      context: 'foo'
    });

    assert.equal(spy.called, true);
  });

  it("throws errors when passed two keys of different types but the same names", function () {
    assert.throws(function () {
      builder({
        directives: {
          defaultSrc: "'self'",
          "default-src": "falco.biz"
        }
      });
    });
  });
});
