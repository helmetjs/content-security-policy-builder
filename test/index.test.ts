import builder = require("..");

describe("builder", () => {
  it("builds no directives", () => {
    const result = builder({ directives: {} });

    expect(result).toStrictEqual("");
  });

  it("builds directives with camelCased keys", () => {
    const result = builder({
      directives: {
        whatThe: "heck",
        defaultSrc: "'self'",
        playtimeIsOver: ["star", "fox"],
      },
    });

    const split = result.split("; ").sort();
    expect(split).toStrictEqual([
      "default-src 'self'",
      "playtime-is-over star fox",
      "what-the heck",
    ]);
  });

  it("builds directives with dash-separated keys", () => {
    const result = builder({
      directives: {
        "do-a": "barrel roll",
        "default-src": "'self'",
        "andross-has-ordered-us": ["to", "take", "you", "down"],
      },
    });

    const split = result.split("; ").sort();
    expect(split).toStrictEqual([
      "andross-has-ordered-us to take you down",
      "default-src 'self'",
      "do-a barrel roll",
    ]);
  });

  it("builds directives with a mix of key types", () => {
    const result = builder({
      directives: {
        "hey-einstein": "i'm on your side",
        defaultSrc: "'self'",
        falco: ["lombardi"],
      },
    });

    const split = result.split("; ").sort();
    expect(split).toStrictEqual([
      "default-src 'self'",
      "falco lombardi",
      "hey-einstein i'm on your side",
    ]);
  });

  it("builds directives with weird keys", () => {
    const result = builder({
      directives: {
        "lots--of----dashes": "wow",
        ALLCAPS: "YELLING",
        InotALWAYScapsNOPE: "ok",
      },
    });

    const split = result.split("; ").sort();
    expect(split).toStrictEqual([
      "allcaps YELLING",
      "inot-alwayscaps-nope ok",
      "lots--of----dashes wow",
    ]);
  });

  it("builds directives with empty values", () => {
    const result = builder({
      directives: {
        these: "",
        are: [],
        empty: [""],
        values: true,
      },
    });

    const split = result.split("; ").sort();
    expect(split).toStrictEqual(["are", "empty", "these", "values"]);
  });

  it("does not include directives if the value is false", () => {
    const result = builder({
      directives: {
        included: "yes",
        skipped: false,
      },
    });

    expect(result).toStrictEqual("included yes");
  });

  it("allows directives with names on Object.prototype", () => {
    const result = builder({
      directives: {
        constructor: "foo",
        hasOwnProperty: "bar",
      },
    });

    expect(result).toStrictEqual("constructor foo; has-own-property bar");
  });

  it("throws errors when passed two keys of different types but the same names", () => {
    expect(() => {
      builder({
        directives: {
          defaultSrc: "'self'",
          "default-src": "falco.biz",
        },
      });
    }).toThrow();
  });
});
