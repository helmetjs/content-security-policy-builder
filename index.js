var dashify = require("dashify");

module.exports = function (options) {
  var directives = options.directives || {};
  var args = options.arguments || [];
  var ctx = options.context || null;

  var keysSeen = {};

  // Recursively handles a value to a string
  function handle(value) {
    if (Array.isArray(value))
      return value.map(handle).join(' ');

    if (typeof value === 'function')
      return handle(value.apply(ctx, args));

    return value;
  }

  return Object.keys(directives).reduce(function (result, originalKey) {
    var directive = dashify(originalKey);

    if (keysSeen[directive]) {
      throw new Error(originalKey + " is specified more than once");
    }
    keysSeen[directive] = true;

    var value = handle(directives[originalKey]);

    var combined;
    if (value) {
      combined = directive + " " + value;
    } else {
      combined = directive;
    }

    result.push(combined);

    return result;
  }, []).join("; ");
};
