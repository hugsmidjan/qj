# Change Log


## Upcoming...
<!-- Add new lines here. Version number will be decided later -->
- ...


## 2.0.0
_2018-11-09_
- [BREAKING] No polyfills are imported automatically. Polyfills are now strictly opt-in to minimize tech-dept
- [BREAKING] Dropped support for `import`ing directly `from  'qj'`. There's no "main" module now. Everything is a submodule.
- Chore: All files are now transpiled to ES5 + CommonJS format
- refactor: Deprecated `qj/objectClean`,  `qj/objectIsEmpty`,  `qj/objectUpdate` in favour of same-named exports from `qj/object`
- refactor: Deprecated `qj/onEvery`,  `qj/onNext` in favour of same-named exports from `qj/time`
- refactor: Renamed `qj/uniqueArray` to `qj/dedupeArray`
- feat: Renamed `groupBy` from `qj/list` to `groupArrayBy` and also exposed it as `qj/groupArrayBy`
- Chore: Sources have been moved into `src/*` sub-folders with their tests alongside them.


## 1.0.0 - 1.19.0 
In the depths of history, there be Tygers...
