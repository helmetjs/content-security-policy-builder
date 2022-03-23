function dashify(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

interface PolicyBuilderOptions {
  directives: Readonly<Record<string, string[] | string | boolean>>;
}

export = function ({ directives }: Readonly<PolicyBuilderOptions>): string {
  const namesSeen = new Set<string>();

  return Object.keys(directives)
    .reduce<string[]>((result, originalName) => {
      const name = dashify(originalName);

      if (namesSeen.has(name)) {
        throw new Error(`${originalName} is specified more than once`);
      }
      namesSeen.add(name);

      let value = directives[originalName];
      if (Array.isArray(value)) {
        value = value.join(" ");
      } else if (value === true) {
        value = "";
      } else if (value === false) {
        return result;
      }

      if (value) {
        return result.concat(`${name} ${value}`);
      } else {
        return result.concat(name);
      }
    }, [])
    .join("; ");
};
