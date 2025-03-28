# Changelog

## 2.3.0 - 2025-03-28

### Added

- `Map`s are now supported as arguments

### Changed

- Arrays are now readonly. This is a TypeScript-only change

## 2.2.0 - 2024-04-25

### Added

- Added ECMAScript Module support

### Removed

- **Breaking:** Drop support for old Node versions. Node 18+ is now required

## 2.1.1 - 2022-03-23

### Changed

- Fixed bug where names on `Object.prototype` didn't work
- Marked inputs as `Readonly` (TypeScript-only)
- Shrink package size a bit

## 2.1.0 - 2019-06-13

### Added

- Added TypeScript type definitions. See
  [#6](https://github.com/helmetjs/content-security-policy-builder/issues/6)
- Created a changelog

### Changed

- Excluded useless files from npm package

This changelog was started after the release of version 2.1.0.
