interface PolicyBuilderOptions {
  directives: Readonly<Record<string, string[] | string | boolean>>;
}

export default function buildContentSecurityPolicy(
  { directives }: Readonly<PolicyBuilderOptions>,
): string {
  const namesSeen = new Set<string>();

  const result: string[] = [];

  Object.entries(directives).forEach(([originalName, value]) => {
    const name = originalName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

    if (namesSeen.has(name)) {
      throw new Error(`${originalName} is specified more than once`);
    }
    namesSeen.add(name);

    if (Array.isArray(value)) {
      value = value.join(" ");
    } else if (value === true) {
      value = "";
    }

    if (value) {
      result.push(`${name} ${value}`);
    } else if (value !== false) {
      result.push(name);
    }
  });

  return result.join("; ");
}
