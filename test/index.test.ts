import builder = require('..');

test('building no directives', () => {
  const result = builder({ directives: {} });
  expect(result).toStrictEqual('');
});

describe('directive name behavior', () => {
  test('building directives with camelCased names', () => {
    const result = builder({
      directives: {
        whatThe: 'heck',
        defaultSrc: "'self'",
        playtimeIsOver: ['star', 'fox'],
      },
    });

    const split = result.split('; ').sort();
    expect(split).toStrictEqual([
      "default-src 'self'",
      'playtime-is-over star fox',
      'what-the heck',
    ]);
  });

  test('building directives with dash-separated names', () => {
    const result = builder({
      directives: {
        'do-a': 'barrel roll',
        'default-src': "'self'",
        'andross-has-ordered-us': ['to', 'take', 'you', 'down'],
      },
    });

    const split = result.split('; ').sort();
    expect(split).toStrictEqual([
      'andross-has-ordered-us to take you down',
      "default-src 'self'",
      'do-a barrel roll',
    ]);
  });

  test('building directives with a mix of name types (camelCased and dash-separated)', () => {
    const result = builder({
      directives: {
        'hey-einstein': "i'm on your side",
        defaultSrc: "'self'",
        falco: ['lombardi'],
      },
    });

    const split = result.split('; ').sort();
    expect(split).toStrictEqual([
      "default-src 'self'",
      'falco lombardi',
      "hey-einstein i'm on your side",
    ]);
  });

  test('converting directive names to lowercase and dashifying them', () => {
    const result = builder({
      directives: {
        'ALLCAPS': 'YELLING',
        'InotALWAYScapsNOPE': 'ok',
      },
    });

    const split = result.split('; ').sort();
    expect(split).toStrictEqual([
      'allcaps YELLING',
      'inot-alwayscaps-nope ok',
    ]);
  });

  test('allows digits in directive names', () => {
    const result = builder({
      directives: {
        '123': 'wow',
        '456-src': 'wow',
      },
    });

    expect(result).toStrictEqual('123 wow; 456-src wow');
  });

  test('allows many hyphens in directive names', () => {
    const result = builder({
      directives: {
        'lots--of----dashes': 'wow',
      },
    });

    expect(result).toStrictEqual('lots--of----dashes wow');
  });

  test('removal of non-alpha directive names, which logs a warning', () => {
    jest.spyOn(console, 'warn').mockReturnValue();

    const result = builder({
      directives: {
        valid: 'ok',
        '': 'empty',
        'invalid_with_underscore': 'bad',
        'invalid with spaces': 'bad',
        ' invalid-with-leading-spaces': 'bad',
        'invalid-with-trailing-spaces ': 'bad',
        'invalid-with-\u{1f}nonprintable': 'bad',
        'inválid-with-nonascii': 'bad',
      },
    });

    expect(result).toStrictEqual('valid ok');

    expect(console.warn).toHaveBeenCalledTimes(7);
  });

  test('errors when passed two keys of different types but the same names', () => {
    expect(() => {
      builder({
        directives: {
          defaultSrc: "'self'",
          'default-src': 'falco.biz',
        },
      });
    }).toThrow();
  });

  test('errors when passed two keys with different casing', () => {
    expect(() => {
      builder({
        directives: {
          SANDBOX: '',
          sandbox: '',
        },
      });
    }).toThrow();
  });
});

describe('directive value behavior', () => {
  test('building directives with empty values', () => {
    const result = builder({
      directives: {
        these: '',
        are: [],
        empty: [''],
        values: true,
      },
    });

    const split = result.split('; ').sort();
    expect(split).toStrictEqual([
      'are',
      'empty',
      'these',
      'values',
    ]);
  });

  test('omitting directives if the value is false', () => {
    const result = builder({
      directives: {
        included: 'yes',
        skipped: false,
      },
    });

    expect(result).toStrictEqual('included yes');
  });


  test('removal of non-printable ASCII characters from values, which logs a warning', () => {
    jest.spyOn(console, 'warn').mockReturnValue();

    const result = builder({
      directives: {
        'invalid-with-commas': 'a.example.com, b.example.com',
        'invalid-with-nonascii': 'á.example.com',
        'invalid-with-nonprintable': 'a.example.com\x1f b.example.com',
        'invalid-with-semicolons': 'a.example.com; b.example.com',
        valid: 'ok',
      },
    });

    const split = result.split(';').map(str => str.trim()).sort();
    expect(split).toStrictEqual([
      'invalid-with-commas a.example.com  b.example.com',
      'invalid-with-nonascii  .example.com',
      'invalid-with-nonprintable a.example.com  b.example.com',
      'invalid-with-semicolons a.example.com  b.example.com',
      'valid ok',
    ]);

    expect(console.warn).toHaveBeenCalledTimes(4);
  });

  test('replaces all ASCII whitespace with spaces', () => {
    const asciiWhitespaceCharacters = [
      '\x09',
      '\x0a',
      '\x0c',
      '\x0d',
    ];

    for (const whitespaceCharacter of asciiWhitespaceCharacters) {
      const result = builder({
        directives: {
          'first-directive': `w.example.com${whitespaceCharacter}x.example.com`,
          'second-directive': `y.example.com${whitespaceCharacter.repeat(2)}z.example.com`,
        },
      });

      expect(result).toStrictEqual('first-directive w.example.com x.example.com; second-directive y.example.com z.example.com');
    }
  });
});
