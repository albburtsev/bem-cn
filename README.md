# bem-cn

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
var Block = require('bem-cn');
```

## Usage

Let's try:

```js
var b = Block('button');

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
b('icon', { name: 'close' }).mix('another'); // 'button__icon button__icon_name_close another'

// States
// As SMACSS states: https://smacss.com/book/type-state
b.state({ hidden: true }); // 'button is-hidden'
b.state({ hidden: false }); // 'button'
b.state({ hidden: true, error: true }); // 'button is-hidden is-error'

// Custom separators
Block.setup({
    el: '~~',
    mod: '-'
});

var b = Block('block');

b('element'); // 'block~~element'
b({ mod: 'value' }); // 'block block-mod-value'
```

Usage with JSX:

```jsx
var Block = require('bem-cn'),
    b = Block('popup');

var Popup = React.createClass({
    render: function() {
        return (
            <div className={b.mix(this.props.mix)}>
            	<span className={b('icon')} />
            	<div class={b('content', { skin: this.props.skin })}>
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
