var builder = require('..')

var assert = require('assert')

describe('builder', function () {
  it('builds no directives', function () {
    var result = builder({ directives: {} })

    assert.equal(result, '')
  })

  it('builds directives with camelCased keys', function () {
    var result = builder({
      directives: {
        whatThe: 'heck',
        defaultSrc: "'self'",
        playtimeIsOver: ['star', 'fox']
      }
    })

    var split = result.split('; ').sort()
    assert.deepEqual(split, [
      "default-src 'self'",
      'playtime-is-over star fox',
      'what-the heck'
    ])
  })

  it('builds directives with dash-separated keys', function () {
    var result = builder({
      directives: {
        'do-a': 'barrel roll',
        'default-src': "'self'",
        'andross-has-ordered-us': ['to', 'take', 'you', 'down']
      }
    })

    var split = result.split('; ').sort()
    assert.deepEqual(split, [
      'andross-has-ordered-us to take you down',
      "default-src 'self'",
      'do-a barrel roll'
    ])
  })

  it('builds directives with a mix of key types', function () {
    var result = builder({
      directives: {
        'hey-einstein': "i'm on your side",
        defaultSrc: "'self'",
        falco: ['lombardi']
      }
    })

    var split = result.split('; ').sort()
    assert.deepEqual(split, [
      "default-src 'self'",
      'falco lombardi',
      "hey-einstein i'm on your side"
    ])
  })

  it('builds directives with weird keys', function () {
    var result = builder({
      directives: {
        'lots--of----dashes': 'wow',
        'ALLCAPS': 'YELLING',
        'InotALWAYScapsNOPE': 'ok'
      }
    })

    var split = result.split('; ').sort()
    assert.deepEqual(split, [
      'allcaps YELLING',
      'inot-alwayscaps-nope ok',
      'lots--of----dashes wow'
    ])
  })

  it('builds directives with empty values', function () {
    var result = builder({
      directives: {
        i: '',
        cant: [],
        lose: [''],
        wow: true
      }
    })

    var split = result.split('; ').sort()
    assert.deepEqual(split, [
      'cant',
      'i',
      'lose',
      'wow'
    ])
  })

  it('does not include directives if the value is false', function () {
    var result = builder({
      directives: {
        included: 'yes',
        skipped: false
      }
    })

    assert.equal(result, 'included yes')
  })

  it('throws errors when passed two keys of different types but the same names', function () {
    assert.throws(function () {
      builder({
        directives: {
          defaultSrc: "'self'",
          'default-src': 'falco.biz'
        }
      })
    })
  })
})
