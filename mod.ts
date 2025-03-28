type DirectiveValue = ReadonlyArray<string> | string | boolean;

interface PolicyBuilderOptions {
  directives: Readonly<
    | Record<string, DirectiveValue>
    | Map<string, DirectiveValue>
  >;
}

export default function buildContentSecurityPolicy(
  { directives }: Readonly<PolicyBuilderOptions>,
): string {
  const result: string[] = [];

  const entries: Iterable<[string, DirectiveValue]> = directives instanceof Map
    ? directives.entries()
    : Object.entries(directives);
  const namesSeen = new Set<string>();

  for (const [rawName, rawValue] of entries) {
    const name = rawName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

    if (namesSeen.has(name)) {
      throw new Error(`${rawName} is specified more than once`);
    }
    namesSeen.add(name);

    if (rawValue === true) {
      result.push(name);
      continue;
    }

    if (rawValue === false) {
      continue;
    }

    const value = typeof rawValue === "string" ? rawValue : rawValue.join(" ");

    result.push(value ? `${name} ${value}` : name);
  }

  return result.join("; ");
}
