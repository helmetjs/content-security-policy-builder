import { build, emptyDir } from "jsr:@deno/dnt";

await emptyDir("./dist/npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./dist/npm",
  shims: { deno: "dev" },
  test: false,
  typeCheck: "both",
  package: {
    name: "content-security-policy-builder",
    author: "Evan Hahn <me@evanhahn.com> (https://evanhahn.com)",
    description: "Build Content Security Policy directives.",
    version: "2.3.0",
    license: "MIT",
    keywords: ["security", "content", "security", "policy", "csp", "builder"],
    homepage: "https://github.com/helmetjs/content-security-policy-builder",
    repository: {
      type: "git",
      url: "git://github.com/helmetjs/content-security-policy-builder.git",
    },
    bugs: {
      url: "https://github.com/helmetjs/content-security-policy-builder/issues",
      email: "me@evanhahn.com",
    },
    engines: {
      node: ">=18.0.0",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "./dist/npm/LICENSE");
    Deno.copyFileSync("README.md", "./dist/npm/README.md");
    Deno.copyFileSync("CHANGELOG.md", "./dist/npm/CHANGELOG.md");
  },
});
