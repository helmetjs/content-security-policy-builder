# Content Security Policy builder

Take an object and turn it into a Content Security Policy string.

It can handle a lot of things you can you throw at it; `camelCased` or `dash-separated` directives, arrays or strings, et cetera.

Usage:

```javascript
const builder = require("content-security-policy-builder");

// default-src 'self' default.com; script-src scripts.com; whatever-src something; object-src
builder({
  directives: {
    defaultSrc: ["'self'", "default.com"],
    scriptSrc: "scripts.com",
    "whatever-src": "something",
    objectSrc: true,
  },
});
```

This module is considered "complete". I expect to continue maintenance if needed, but I don't plan to add features or make breaking changes.
