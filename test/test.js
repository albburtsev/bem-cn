'use strict';

var should = require('should');

// var Block = require('../dest/bem-flash');
var Block = function() {};

describe('Wrapper function Block', function() {
	it('should be a function', function(){
		should(Block).be.an.instanceOf(Function);
	});
});

describe('Block instance', function() {
	it('should return given block name', function() {
		var b = Block('button');
		should(b()).equal('button');
		should(b.toString()).equal('button');
	});

	it('should have all necessary methods', function() {
		var b = Block('button');
		should(b.toString).be.an.instanceOf(Function);
		should(b.mix).be.an.instanceOf(Function);
	});
});

describe('Callable block instance', function() {
	var b = Block('parent');

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
		should(
			b.mix('outer').toString()
		).equal('parent outer');
		should(
			b('child').mix('outer').toString()
		).equal('parent__child outer');
	});
});
