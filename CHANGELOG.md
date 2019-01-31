# Change Log


## Upcoming...
<!-- Add new lines here. Version number will be decided later -->
- ...
- fix: Remove accidentally commited testing code in `replaceNode()`


## 2.2.1
_2019-01-05_
- fix: Some source file-changes weren't built before last release


## 2.2.0
_2019-01-04_
- feat: Support install via Windows command prompt
- feat: Add `qj/simpleSlugify` to turn "latin" strings into URL-friendlier format.


## 2.1.0
_2018-11-12_
- feat: Add support for custom `document` in `htmlToDiv()` to make html parsing server-side easier.
- fix: Make `closestParent()` also work with SVG elements.
- fix: Make `htmlToDiv()`'s html-disabling RegExp safer.
- chore: Prevent "postinstall" script from running when installing locally and/or adding dependencies.
- chore: Improve test/dev script hehavior


## 2.0.0
_2018-11-09_
- [BREAKING] No polyfills are imported automatically. Polyfills are now strictly opt-in to minimize tech-dept
- [BREAKING] Dropped support for `import`ing directly `from  'qj'`. There's no "main" module now. Everything is a submodule.
- Chore: All files are now transpiled to ES5 + CommonJS format
- refactor: Deprecated `qj/objectClean`,  `qj/objectIsEmpty`,  `qj/objectUpdate` in favour of same-named exports from `qj/object`
- refactor: Deprecated `qj/onEvery`,  `qj/onNext` in favour of same-named exports from `qj/time`
- refactor: Deprecated  `qj/uniqueArray` and renamed it to `qj/dedupeArray`
- refactor: Renamed `qj/list`'s `groupBy` to `groupArrayBy` and also exposed it as `qj/groupArrayBy`
- Chore: Sources have been moved into `src/*` sub-folders with their tests alongside them.


## 1.0.0 - 1.19.0 
In the depths of history, there be Tygers...
