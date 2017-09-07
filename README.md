# QJ - Quick JavaScripts

Collection of useful miniature JavaScript helper functions exposed as es6 modules.

The functions try to be small, stupid, and side-effect free.


## Install

    npm install --save-dev git+git@github.com:hugsmidjan/qj.git#v1


## Usage

Importing named exports from the `qj` package, like so:

```js
import {
    alphabetize,
    focusElm,
    q,
    qq as Q,
} from 'qj';
```

...should be effectively the same as importing those functions as standalone modules, like so:

```js
import alphabetize from 'qj/alphabetize';
import focusElm from 'qj/focusElm';
import q from 'qj/q';
import Q from 'qj/qq';
```


## CommonJS modules

If your build environment doesn't support loading ES6 modules from `node_modules`, then you need to change your dependency to point to the `v1-cjs` branch:

    npm install --save-dev git+git@github.com:hugsmidjan/qj.git#v1-cjs

