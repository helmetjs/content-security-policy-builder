var dashify = require("dashify");

module.exports = function (options) {
  var directives = options.directives;

  return Object.keys(directives).reduce(function (result, originalKey) {
    var directive = dashify(originalKey);

    var value = directives[originalKey];
    if (Array.isArray(value)) {
      value = value.join(" ");
    }

    var combined = directive + " " + value;

    if (directive === "default-src") {
      result.unshift(combined);
    } else {
      result.push(combined);
    }

    return result;
  }, []).join("; ");
};
