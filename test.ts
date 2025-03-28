import { assertEquals, assertThrows } from "jsr:@std/assert";
import builder from "./mod.ts";

const test = (
  message: string,
  directives: Readonly<Record<string, string[] | string | boolean>>,
  expected: ReadonlyArray<string>,
) => {
  Deno.test(`${message} (as object)`, () => {
    const result = builder({ directives });
    const normalized = result.split("; ").sort();
    assertEquals(normalized, expected, message);
  });

  Deno.test(`${message} (as Map)`, () => {
    const result = builder({ directives: new Map(Object.entries(directives)) });
    const normalized = result.split("; ").sort();
    assertEquals(normalized, expected, message);
  });
};

test("no directives", {}, [""]);

test(
  "directives with camelCased keys",
  {
    whatThe: "heck",
    defaultSrc: "'self'",
    playtimeIsOver: ["star", "fox"],
  },
  ["default-src 'self'", "playtime-is-over star fox", "what-the heck"],
);

test(
  "directives with dash-separated keys",
  {
    "do-a": "barrel roll",
    "default-src": "'self'",
    "andross-has-ordered-us": ["to", "take", "you", "down"],
  },
  [
    "andross-has-ordered-us to take you down",
    "default-src 'self'",
    "do-a barrel roll",
  ],
);

test(
  "directives with a mix of key types",
  {
    "hey-einstein": "i'm on your side",
    defaultSrc: "'self'",
    falco: ["lombardi"],
  },
  ["default-src 'self'", "falco lombardi", "hey-einstein i'm on your side"],
);

test(
  "directives with weird keys",
  {
    "lots--of----dashes": "wow",
    ALLCAPS: "YELLING",
    InotALWAYScapsNOPE: "ok",
  },
  ["allcaps YELLING", "inot-alwayscaps-nope ok", "lots--of----dashes wow"],
);

test(
  "directives with empty values",
  {
    these: "",
    are: [],
    empty: [""],
    values: true,
  },
  ["are", "empty", "these", "values"],
);

test(
  "does not include directives if the value is false",
  {
    included: "yes",
    skipped: false,
  },
  ["included yes"],
);

test(
  "allows directives with names on Object.prototype",
  {
    constructor: "foo",
    hasOwnProperty: "bar",
  },
  ["constructor foo", "has-own-property bar"],
);

Deno.test("throws when passed two keys of different types but the same names", () => {
  assertThrows(() => {
    builder({
      directives: { defaultSrc: "'self'", "default-src": "falco.biz" },
    });
  });
});
