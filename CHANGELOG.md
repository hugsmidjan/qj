# Change Log

## Upcoming...

- <!-- Add new lines here. Version number will be decided later -->
- feat: Allow calling `eventify()` with no arguents
- docs: Improve docs and type signature of `parseParams()`

## 3.6.0

_2020-03-04_

- feat: Add `throttle.d(delay, skipFirst)` sugar for dynamic function bodies
- feat: Pass extra arguments into the function passed to `debounce.d()`
- feat: Add `debFn.cancel(true);` signature to finish (run) a debounced call
- feat: Add `thrttlFn.finish(true);` signature to cancel the trailing call

## 3.5.0

_2020-02-10_

- feat: Add `assertNever()` exhaustive type check helper
- feat: Add `range(from, to, step)`

## 3.4.0

_2019-12-06_

- feat: Add a simple `validKennitala()` and `validCreditcard()` checkers
- feat: `arrayToObject()` now takes "prop" function, emits uniform objects –
  Where for non-object arrays the values of the returned object are now the
  raw array items (Technically a breaking change.)

## 3.3.0

_2019-11-21_

- feat: Add `polyfills/Array.prototype.findIndex`
- feat: Add `polyfills/Object.fromEntries`
- feat: Add `polyfills/Event` for IE11

## 3.2.3

_2019-11-20_

- fix: Prevent `parseParams()` emitting nully URL params
- fix: Make `shuffle()` non-mutating by default

## 3.2.1 – 3.2.2

_2019-11-18_

- fix: `removeNode()` should accept `null`
- fix(ts): Mark `focusElm()` options parameter as optional

## 3.2.0

_2019-11-13_

- feat: Add `polyfills/IntersectionObserver`

## 3.1.0

_2019-11-11_

- feat: Add `getScrollbarWidth` to get browser scrollbar width
- feat(ts): Add generic type support to `parseParams()`
- fix: Make `parseParams` return empty object for `undefined` input

## 3.0.0

_2019-11-06_

- **BREAKING** feat: Rename module to `@hugsmidjan_is/qj` and rewamp
  publishing scripts

## 2.7.0

_2019-10-29_

- feat: Add `curryRight()` alternative to `curry`

## 2.6.0

_2019-10-05_

- feat: Add `splitUrl()` returning `{ url, queryString, hash }`
- feat: Add FP helpers `pipe()` and `chain()`

## 2.5.1

_2019-08-07_

- fix: `inject` with multiple variables didn't work

## 2.5.0

_2019-07-31_

- feat: Convert sources to TypeScript and emit declaration files
- feat: `makeQueryString` spreads arrays into multple same-name query
  parameters
- fix: Treat undefined `env.INIT_CWD` (yarn win10 linux) as dep install
- chore: Upgrade dependencies

## 2.4.0

_2019-04-24_

- feat: Add `qj/polyfills/Object.entries`

## 2.3.1

_2019-02-012_

- fix: Correctly judge document scroll offset in `focusElm()` and `frag.set()`

## 2.3.0

_2019-02-05_

- feat: Add `delay` option to `focusElm()`

## 2.2.2

_2019-01-31_

- fix: Remove accidentally commited testing code in `replaceNode()`

## 2.2.1

_2019-01-05_

- fix: Some source file-changes weren't built before last release

## 2.2.0

_2019-01-04_

- feat: Support install via Windows command prompt
- feat: Add `qj/simpleSlugify` to turn "latin" strings into URL-friendlier
  format.

## 2.1.0

_2018-11-12_

- feat: Add support for custom `document` in `htmlToDiv()` to make html
  parsing server-side easier.
- fix: Make `closestParent()` also work with SVG elements.
- fix: Make `htmlToDiv()`'s html-disabling RegExp safer.
- chore: Prevent "postinstall" script from running when installing locally
  and/or adding dependencies.
- chore: Improve test/dev script hehavior

## 2.0.0

_2018-11-09_

- [BREAKING] No polyfills are imported automatically. Polyfills are now
  strictly opt-in to minimize tech-dept
- [BREAKING] Dropped support for `import`ing directly `from 'qj'`. There's no
  "main" module now. Everything is a submodule.
- Chore: All files are now transpiled to ES5 + CommonJS format
- refactor: Deprecated `qj/objectClean`, `qj/objectIsEmpty`, `qj/objectUpdate`
  in favour of same-named exports from `qj/object`
- refactor: Deprecated `qj/onEvery`, `qj/onNext` in favour of same-named
  exports from `qj/time`
- refactor: Deprecated `qj/uniqueArray` and renamed it to `qj/dedupeArray`
- refactor: Renamed `qj/list`'s `groupBy` to `groupArrayBy` and also exposed
  it as `qj/groupArrayBy`
- Chore: Sources have been moved into `src/*` sub-folders with their tests
  alongside them.

## 1.0.0 - 1.19.0

In the depths of history, there be Tygers...
