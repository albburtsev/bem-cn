# bem-cn
[![Build Status](https://secure.travis-ci.org/albburtsev/bem-cn.png?branch=master)](https://travis-ci.org/albburtsev/bem-cn)
[![Coverage Status](https://coveralls.io/repos/albburtsev/bem-cn/badge.svg?branch=master)](https://coveralls.io/r/albburtsev/bem-cn?branch=master)

Friendly [BEM](https://en.bem.info/) class names generator. Great for [React](http://facebook.github.io/react/).

**Bem-cn** (aka BEM Class Name) is extra small (minified+gzipped less than 1Kb) and extremely simple client-side library and Node.js module.

Inspired by [b_](https://github.com/azproduction/b_).

## Why?

Why I created yet another node module?

I spent a lot of time finding [BEM](https://en.bem.info/) class name generator, that meets my needs:

 * Simple usage with React
 * Support modifiers without value
 * Mix multiple blocks
 * Friendly chainable API

But now (March 2015) I can't find it. That's why.

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
var block = require('bem-cn');
```

## Usage

Let's try:

```js
var b = block('button');

// Block
b; // 'button'
b(); // 'button'

// Element
b('icon'); // 'button__icon'

// Modifier
b({ type: 'text' });  // 'button button_type_text'
b({ type: 'text' }, { type: 'colored' }); // 'button button_type_text button_type_colored'
b({ onlykey: true });  // 'button button_onlykey'
b({ without: false });  // 'button'

// Mix
b('icon').mix('another'); // 'button__icon another'
b('icon').mix([ 'one', 'two' ]); // 'button__icon one two'
b('icon').mix({ one: true, two: false, three: true }); // 'button__icon one three'

// States
// As SMACSS states: https://smacss.com/book/type-state
b.state({ hidden: true }); // 'button is-hidden'
b.state({ hidden: false }); // 'button'
b.state({ hidden: true, error: true }); // 'button is-hidden is-error'
```

```js
// Setup custom separators
block.setup({
    el: '~~',
    mod: '--',
    modValue: '-'
});

var b = block('block');

b('element'); // 'block~~element'
b({ mod: 'value' }); // 'block block--mod-value'
```

```js
// Setup own namespace
block.setup({ ns: 'ns-' });

var b = block('block');
b(); // 'ns-block'
```

Usage with JSX:

```jsx
var block = require('bem-cn'),
    b = block('popup');

var Popup = React.createClass({
    render: function() {
        return (
            <div className={b.mix(this.props.mix)}>
            	<span className={b('icon')} />
            	<div className={b('content', { skin: this.props.skin })}>
            		{this.props.children}
            	</div>
            </div>
        );
    }
});

React.render(<Popup mix="another" skin="bright" />, target);
/*
<div class="popup another">
	<span class="popup__icon"></span>
	<div class="popup__content popup__content_skin_bright">
	</div>
</div>
 */
```
