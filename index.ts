const DIRECTIVE_NAME_REGEXP = /^[-a-zA-Z0-9]+$/;
const DIRECTIVE_VALUE_REGEXP = /^[\t\n\f\r \x21-\x2b\x2d-\x3a\x3c-\x7e]*$/;
const WHITESPACE_TO_REPLACE = /[\t\n\f\r]+/g;

function dashify (str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function has (obj: Readonly<{[key: string]: unknown}>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const isNameValid = DIRECTIVE_NAME_REGEXP.test.bind(DIRECTIVE_NAME_REGEXP);
const isDirectiveValueValid = DIRECTIVE_VALUE_REGEXP.test.bind(DIRECTIVE_VALUE_REGEXP);

interface PolicyBuilderOptions {
  readonly directives: {
    readonly [directive: string]: string[] | string | boolean;
  };
}

export = function ({ directives }: Readonly<PolicyBuilderOptions>): string {
  const result: string[] = [];
  // When we drop support for old Node versions, we can change this to a Set.
  const directiveNamesSeen: { [directive: string]: boolean } = {};

  for (const originalDirectiveName in directives) {
    if (!has(directives, originalDirectiveName)) {
      continue;
    }

    if (!isNameValid(originalDirectiveName)) {
      console.warn(`Removing key ${JSON.stringify(originalDirectiveName)} because it contained a non-alpha non-hyphen character. This will throw an error in future versions.`);
      continue;
    }

    const directiveName = dashify(originalDirectiveName);

    if (has(directiveNamesSeen, directiveName)) {
      throw new Error(`${originalDirectiveName} is specified more than once`);
    }
    directiveNamesSeen[directiveName] = true;

    let directiveValue = directives[originalDirectiveName];
    if (Array.isArray(directiveValue)) {
      directiveValue = directiveValue.join(' ');
    } else if (directiveValue === true) {
      directiveValue = '';
    } else if (directiveValue === false) {
      continue;
    }

    directiveValue = directiveValue.replace(WHITESPACE_TO_REPLACE, ' ');

    if (!isDirectiveValueValid(directiveValue)) {
      console.warn('Directive value contains an invalid character. Replacing it with a space. This will throw an error in future versions.');

      // This probably isn't the best way to do this, but we'll remove it in future versions.
      let newDirectiveValue = '';
      for (let index = 0; index < directiveValue.length; index += 1) {
        const character = directiveValue.charAt(index);
        if (DIRECTIVE_VALUE_REGEXP.test(character)) {
          newDirectiveValue += character;
        } else {
          newDirectiveValue += ' ';
        }
      }
      directiveValue = newDirectiveValue;
    }

    if (directiveValue) {
      result.push(`${directiveName} ${directiveValue}`);
    } else {
      result.push(directiveName);
    }
  }

  return result.join('; ');
}
