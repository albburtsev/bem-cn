'use strict';

var should = require('should'),
	block = require('../src/bem-cn');

describe('Wrapper function block', function() {
	it('should be a function', function(){
		should(block).be.an.instanceOf(Function);
	});
});

describe('Block instance', function() {
	it('should return given block name', function() {
		var b = block('button');
		should(b).be.an.instanceOf(Function);
		should(b().toString()).equal('button');
		should(b.toString()).equal('button');
	});

	it('should return splitted block name', function() {
		var b = block('button');
		b = b({ mod: true });
		should(b.split(' ')).be.an.instanceOf(Array);
		should(b().split(' ')).eql(['button', 'button_mod']);
		should(b.split(' ')).eql(['button', 'button_mod']);
	});

	it('should have all necessary methods', function() {
		var b = block('button');
		should(b.toString).be.an.instanceOf(Function);
		should(b.mix).be.an.instanceOf(Function);
		should(b.state).be.an.instanceOf(Function);
		should(b.split).be.an.instanceOf(Function);
	});
});

describe('Callable block instance', function() {
	var b = block('parent');

	it('should return elements class name', function() {
		should(
			b('child').toString()
		).equal('parent__child');
		should(
			b('child', 'infant').toString()
		).equal('parent__child__infant');
	});

	it('should return block modifier', function() {
		should(
			b({ color: 'dark' }).toString()
		).equal('parent parent_color_dark');
		should(
			b({ color: 'dark' }, { color: 'green' }).toString()
		).equal('parent parent_color_dark parent_color_green');
		should(
			b({ color: 'dark', value: 'none' }).toString()
		).equal('parent parent_color_dark parent_value_none');
	});

	it('should return element modifier', function() {
		should(
			b('child', { color: 'dark' }).toString()
		).equal('parent__child parent__child_color_dark');
		should(
			b('child', { color: 'dark' }, { color: 'green' }).toString()
		).equal('parent__child parent__child_color_dark parent__child_color_green');
		should(
			b('child', { color: 'dark', value: 'none' }).toString()
		).equal('parent__child parent__child_color_dark parent__child_value_none');
	});

	it('should create modifier without value', function() {
		should(
			b({ value: true }).toString()
		).equal('parent parent_value');
		should(
			b({ value: false }).toString()
		).equal('parent');
	});

	it('should append mixed class', function() {
		var another = block('another');

		should(
			b.mix('outer').toString()
		).equal('parent outer');
		should(
			b('child').mix('outer').toString()
		).equal('parent__child outer');
		should(
			b('icon', { name: 'close' }).mix('another').toString()
		).equal('parent__icon parent__icon_name_close another');
		should(
			b.mix([ 'one', 'two' ]).toString()
		).equal('parent one two');
		should(
			b.mix({ one: true, two: false, three: true }).toString()
		).equal('parent one three');
		should(
			b.mix(another).toString()
		).equal('parent another');
		should(
			b.mix(another('child')).toString()
		).equal('parent another__child');
		should(
			b.mix(another({ color: 'dark' })).toString()
		).equal('parent another another_color_dark');
		should(
			b('icon', { name: 'close' }).mix(another({ color: 'dark' })).toString()
		).equal('parent__icon parent__icon_name_close another another_color_dark');
	});
});

describe('Unexpected arguments', function() {
	var b = block('block');

	it('should be silent when passed unexpected value', function() {
		should(
			b(null).toString()
		).equal('block');
		should(
			b.mix(null).toString()
		).equal('block');
		should(
			b(null).mix(null).toString()
		).equal('block');
		should(
			b()()()().toString()
		).equal('block');
	});
});

describe('States', function() {
	var b = block('block');

	it('should set states', function() {
		should(
			b.state({ hidden: true }).toString()
		).equal('block is-hidden');
		should(
			b.state({ hidden: false }).toString()
		).equal('block');
		should(
			b.state({ hidden: true, error: true }).toString()
		).equal('block is-hidden is-error');
		should(
			b('element').state({ hidden: true }).toString()
		).equal('block__element is-hidden');
		should(
			b({ mod: 'value' }).state({ hidden: true }).toString()
		).equal('block block_mod_value is-hidden');
	});
});

describe('Setup custom settings', function() {
	it('should be method setup()', function() {
		should(block.setup).be.an.instanceOf(Function);
	});

	it('should be custom separators and namespace', function() {
		block.setup({
			ns: 'ns-',
			el: '~~',
			mod: '-',
		});

		var b = block('block');

		should(
			b('element').toString()
		).equal('ns-block~~element');
		should(
			b({ mod: 'value' }).toString()
		).equal('ns-block ns-block-mod-value');
		should(
			b({ mod: true }).toString()
		).equal('ns-block ns-block-mod');
		should(
			b('element', { mod: 'value' }).toString()
		).equal('ns-block~~element ns-block~~element-mod-value');
	});
});
