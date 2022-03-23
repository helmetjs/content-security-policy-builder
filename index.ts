function dashify(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

interface PolicyBuilderOptions {
  directives: { [directive: string]: string[] | string | boolean };
}

export = function ({ directives }: PolicyBuilderOptions): string {
  const keysSeen = new Set<string>();

  return Object.keys(directives)
    .reduce<string[]>((result, originalKey) => {
      const directive = dashify(originalKey);

      if (keysSeen.has(directive)) {
        throw new Error(`${originalKey} is specified more than once`);
      }
      keysSeen.add(directive);

      let value = directives[originalKey];
      if (Array.isArray(value)) {
        value = value.join(" ");
      } else if (value === true) {
        value = "";
      } else if (value === false) {
        return result;
      }

      if (value) {
        return result.concat(`${directive} ${value}`);
      } else {
        return result.concat(directive);
      }
    }, [])
    .join("; ");
};
