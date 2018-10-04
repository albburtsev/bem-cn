### 2018-10-04 v3.0.1

 * Fix error in bundle when node failed on `window` ref [#49](https://github.com/albburtsev/bem-cn/pull/49)

### 2018-08-24 v3.0.0

 * Compatible with React 16+
 * Source code re-written with TypeScript. Added built-in typings.
 * **BREAKING CHANGE** Exported top-level method `setup`, that returns new block factory
 * **BREAKING CHANGE** Removed method `reset`
 * **BREAKING CHANGE** Call chains like `b('element')({ color: 'red' })` not supported

### 2016-09-25 v2.1.3

 * Bugfix: buggy mix with namespace [#32](https://github.com/albburtsev/bem-cn/issues/32)

### 2016-06-22 v2.1.2

 * Added `.babelrc` to `.npmignore`

### 2016-06-19 v2.1.1

 * Bugfix: make `setup` and `reset` methods truly static

### 2016-06-18 v2.1.0

 * Exports `default` in Babel 5 style with [babel-plugin-add-module-exports](https://www.npmjs.com/package/babel-plugin-add-module-exports)

### 2016-06-04 v2.0.0

 * Source code was rewritten from scratch
 * Block function trims given block name
 * Block function throws exception if block name isn't a string or empty string
 * Impossible to add several modifiers with the same name: `block('button')({skin: 'dark'})({skin: 'light'}); // "button_skin_light"`
 * Method `mix` doesn't support objects
 * Implemented static method `block.reset()`
 * Implemented new state-methods `is()` and `has()`

### 2016-11-05 v1.3.1

 * Class mapping support

### 2016-16-02 v1.2.2

 * Added ability to specify name/value separator for modifier

### 2015-10-06 v1.2.1

 * Bugfix: incorrect states for non boolean values in given object

### 2015-09-17 v1.2.0

 * Namespace available for setup in general settings

### 2015-09-07 v1.1.1

 * Method ```mix()``` supports another blocks

### 2015-08-12 v1.1.0

 * Breaking change for usage in browser: entry point ```Block``` renamed to ```block```
 * Method ```mix``` supports arrays and object

### 2015-05-11 v1.0.0

First stable release.

 * Generates block's name
 * Generates element's name
 * Adds modifiers with or without value
 * Mixes another class name
 * Supports SMACSS states
 * Supports custom separators
