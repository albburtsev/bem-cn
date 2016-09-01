# BEM class names generator
[![Build Status](https://secure.travis-ci.org/albburtsev/bem-cn.png?branch=master)](https://travis-ci.org/albburtsev/bem-cn)
[![Coverage Status](https://coveralls.io/repos/albburtsev/bem-cn/badge.svg?branch=master)](https://coveralls.io/r/albburtsev/bem-cn?branch=master)

Friendly [BEM](https://en.bem.info/) class names generator. Great for [React](http://facebook.github.io/react/).

**Bem-cn** (aka BEM Class Name) is extra small (minified+gzipped less than 1.5Kb) and extremely simple client-side library and Node.js module.

Inspired by [b_](https://github.com/azproduction/b_).

## Justification

I spent a lot of time finding [BEM](https://en.bem.info/) class name generator, that meets my needs:

 * Simple usage with React
 * Support modifiers without value
 * Mix multiple blocks
 * Friendly chainable API

When my efforts had led to naught I've created this micro library.

## Install

With Node.js:

```bash
npm i --save bem-cn
```

Or use [Bower](http://bower.io/) for install:

```bash
bower install --save bem-cn
```

Works with [webpack](http://webpack.github.io/) and [browserify](http://browserify.org/):

```js
// CommonJS
var block = require('bem-cn');

// or ES6 modules
import block from 'bem-cn';
```

## Cheat sheet

```js
var b = block('button');

// Block
b; // 'button'
b(); // 'button'

// Element
b('icon'); // 'button__icon'

// Modifier
b({type: 'text'});  // 'button button_type_text'
b({onlykey: true});  // 'button button_onlykey'
b({without: false});  // 'button'

b('icon', {name: 'check'}); // 'button__icon button__icon_name_check'
b('icon')({name: 'check'}); // 'button__icon button__icon_name_check'

// Mix another classes
b('icon').mix('another'); // 'button__icon another'
b('icon').mix(['one', 'two']); // 'button__icon one two'

// States like in SMACSS: https://smacss.com/book/type-state
b.state({hidden: true}); // 'button is-hidden'
b.state({hidden: false}); // 'button'
b.state({hidden: true, error: true}); // 'button is-hidden is-error'

// More states!
b.is({loading: true}); // 'button is-loading'
b.has({content: true}); // 'button has-content'
```

```js
// Setup custom delimiters
block.setup({
    el: '~~',
    mod: '--',
    modValue: '-'
});

var b = block('block');

b('element'); // 'block~~element'
b({mod: 'value'}); // 'block block--mod-value'
```

```js
// Setup namespace
block.setup({ns: 'ns-'});

var b = block('block');

b(); // 'ns-block'
b('element'); // 'ns-block__element'
b({mod: 'value'}); // 'ns-block ns-block_mod_value'
```

## Try it with React

```js
import block from 'bem-cn';
import React from 'react';
import ReactDOM from 'react-dom';

let b = block('popup');

let Popup = React.createClass({
    render() {
        let {skin, children} = this.props;

        return (
            <div className={b}>
            	<span className={b('icon')} />
            	<div className={b('content', {skin})}>
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

### PropTypes warnings

`bem-cn` has specific chainable API. As a result, each call returns function for a further call. But most components are expecting property `className` as a string and using `propTypes` object for check this. In this case, you will see a warning. There are the couple of ways to avoid these warnings below.

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
        className: React.PropTypes.oneOf([
            React.PropTypes.string,
            React.PropTypes.func
        ])
    },
    // ...
});
```

### ES3 browsers

`bem-cn` is fully compatible with ES5 browsers. If you are going to support ES3 browsers than just use [es5 shim](https://github.com/es-shims/es5-shim).
