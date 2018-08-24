# BEM class names generator
[![Build Status](https://secure.travis-ci.org/albburtsev/bem-cn.png?branch=master)](https://travis-ci.org/albburtsev/bem-cn) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Friendly [BEM](https://en.bem.info/) class names generator. Great for [React](http://facebook.github.io/react/).

**Bem-cn** (aka BEM Class Name) is extra small (minified+gzipped less than 1.6Kb) and extremely simple client-side library and Node.js module.

**Important!** Only `bem-cn@3.x+` compatible with `react@16+`.
Please do not use version 2.x or lower.
[More](https://github.com/facebook/react/issues/10857) [details](https://github.com/facebook/react/issues/10756) about the problem.

Inspired by [b_](https://github.com/azproduction/b_).

## Justification

I spent a lot of time finding [BEM](https://en.bem.info/) class name generator, that meets my needs:

 * Simple usage with React
 * Support modifiers without value
 * Mix multiple blocks
 * Friendly API

When my efforts had led to naught I've created this micro library.

## Install

With Node.js:

```bash
npm i --save bem-cn
yarn add bem-cn
```

Works with [webpack](http://webpack.github.io/) and [browserify](http://browserify.org/):

```js
// CommonJS
var { block } = require('bem-cn');

// ES6
import { block } from 'bem-cn';
```

## API

```js
const b = block('button');

// Block
b(); // 'button'

// Element
b('icon'); // 'button__icon'

// Modifier
b({ type: 'text' });  // 'button button_type_text'
b({ onlykey: true });  // 'button button_onlykey'
b({ without: false });  // 'button'

b('icon', { name: 'check' }); // 'button__icon button__icon_name_check'

// Mix another classes
b('icon').mix('another'); // 'button__icon another'
b('icon').mix(['one', 'two']); // 'button__icon one two'

// States like in SMACSS: https://smacss.com/book/type-state
b.state({ hidden: true }); // 'button is-hidden'
b.state({ hidden: false }); // 'button'
b.state({ hidden: true, error: true }); // 'button is-hidden is-error'

// More states!
b.is({ loading: true }); // 'button is-loading'
b.has({ content: true }); // 'button has-content'
```

```js
// Setup custom delimiters
import { setup } from 'bem-cn';

const block = setup({
    el: '~~',
    mod: '--',
    modValue: '-'
});

const b = block('block');

b('element'); // 'block~~element'
b({ mod: 'value' }); // 'block block--mod-value'
```

```js
// Setup namespace
const block = setup({ ns: 'ns-' });

const b = block('block');

b(); // 'ns-block'
b('element'); // 'ns-block__element'
b({ mod: 'value' }); // 'ns-block ns-block_mod_value'
```

## Try it with React

```js
import block from 'bem-cn';
import React from 'react';
import ReactDOM from 'react-dom';

const b = block('popup');

const Popup = React.createClass({
    render() {
        const { skin, children } = this.props;

        return (
            <div className={b()}>
            	<span className={b('icon')} />
            	<div className={b('content', { skin })}>
            		{children}
            	</div>
            </div>
        );
    }
});

ReactDOM.render(<Popup skin="bright">Hello!</Popup>, target);

/*
<div class="popup">
	<span class="popup__icon"></span>
	<div class="popup__content popup__content_skin_bright">
        Hello!
	</div>
</div>
 */
```

## Troubleshooting

### Maigrate to version 3.x

@todo

### PropTypes warnings

`bem-cn@2.x` or lower has specific chainable API. As a result, each call returns function for a further call. But most components are expecting property `className` as a string and using `propTypes` object for check this. In this case, you will see a warning. There are the couple of ways to avoid these warnings below.

#### #1

Use final call without arguments to get a string

```jsx
<CustomComponent className={b('icon')()} />
```

#### #2

Use explicit call of method `toString()`:

```jsx
<CustomComponent className={b('icon').toString()} />
```

#### #3

Use less specific propTypes rules:

```js
let CustomComponent = React.createClass({
    propTypes: {
        className: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ])
    },
    // ...
});
```

### ES3 browsers

`bem-cn` is fully compatible with ES5 browsers. If you are going to support ES3 browsers than just use [es5 shim](https://github.com/es-shims/es5-shim).
