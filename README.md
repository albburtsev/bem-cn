# bem-cn

Friendly generator of [BEM](https://en.bem.info/) class names. Inspired by [b_](https://github.com/azproduction/b_).

## Why?

Why I created yet another node module?

I spent a lot of time finding [BEM](https://en.bem.info/) class name generator, that meets my needs:

 * Simple usage with [React](http://facebook.github.io/react/)
 * Support modifiers without value
 * Support nested elements
 * Simple mix other classes

But now (March 2015) I can't find it. That's why.

## Install

TODO

## Usage

Let's try:

```js
var b = Block('button');

b; // 'button'
b(); // 'button'
b('icon'); // 'button__icon'
b({ type: 'text' });  // 'button_type_text'
b('icon', { name: 'close' }).mix('another'); // 'button__icon button__icon_name_close another'
```

Usage with JSX:

```js
var b = Block('icon');

var Icon = React.createClass({
    render: function() {
        return (
            <span className={b({ name: this.props.name }).mix(this.props.mix)}></span>
        );
    }
});

React.render(<Icon name="close" mix="outer__element">); // '<span class="icon icon_close outer__element">'
```