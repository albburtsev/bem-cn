import should from 'should';
import block, {ERROR_BLOCK_NAME_TYPE, ERROR_BLOCK_NAME_EMPTY} from './../src/bem-cn';


describe('Wrapper function block', () => {
	it('should be a function', () => {
		should(block).be.an.instanceOf(Function);
	});
});

describe('Block output', () => {
	it('should be a given block name', () => {
		let b = block('button');

		should(b).be.an.instanceOf(Function);
		should(b().toString()).equal('button');
		should(b.toString()).equal('button');
	});

	it('should have all necessary methods', () => {
		let b = block('button');

		should(b.is).be.an.instanceOf(Function);
		should(b.has).be.an.instanceOf(Function);
		should(b.mix).be.an.instanceOf(Function);
		should(b.state).be.an.instanceOf(Function);
		should(b.split).be.an.instanceOf(Function);
		should(b.toString).be.an.instanceOf(Function);
	});
});

describe('Block name', () => {
	it('should be a string', () => {
		should(() => {
			block();
		}).throw(ERROR_BLOCK_NAME_TYPE);
		should(() => {
			block(1);
		}).throw(ERROR_BLOCK_NAME_TYPE);
		should(() => {
			block({});
		}).throw(ERROR_BLOCK_NAME_TYPE);
		should(() => {
			block(true);
		}).throw(ERROR_BLOCK_NAME_TYPE);
		should(() => {
			block(null);
		}).throw(ERROR_BLOCK_NAME_TYPE);
	});

	it('should be non-empty string', () => {
		should(() => {
			block('');
		}).throw(ERROR_BLOCK_NAME_EMPTY);
	});

	it('should be trimmed', () => {
		should(() => {
			block(' ');
		}).throw(ERROR_BLOCK_NAME_EMPTY);

		should(block(' button ').toString()).equal('button');
	});
});

describe('Selector function', () => {
	it('should return elements class name', () => {
		let b = block('parent');

		should(
			b('child').toString()
		).equal('parent__child');
		should(
			b('child', 'infant').toString()
		).equal('parent__child__infant');
	});

	it('should return block with modifier', () => {
		let b = block('parent');

		should(
			b({color: 'dark'}).toString()
		).equal('parent parent_color_dark');
		should(
			b({color: 'dark', value: 'none'}).toString()
		).equal('parent parent_color_dark parent_value_none');
	});

	it('should not add some modifiers with the same name', () => {
		let b = block('parent');

		should(
			b({skin: 'dark'}, {skin: 'light'}).toString()
		).equal('parent parent_skin_light');
		should(
			b({skin: 'dark'})({skin: 'light'}).toString()
		).equal('parent parent_skin_light');
		should(
			b('child', {skin: 'dark'}, {skin: 'light'}).toString()
		).equal('parent__child parent__child_skin_light');
	});

	it('should not add modifiers with falsy values', () => {
		let b = block('parent');

		should(
			b({mod: 0}).toString()
		).equal('parent');
		should(
			b({mod: ''}).toString()
		).equal('parent');
		should(
			b({mod: null}).toString()
		).equal('parent');
		should(
			b({mod: false}).toString()
		).equal('parent');
		should(
			b({mod: undefined}).toString()
		).equal('parent');
	});

	it('should return element modifier', () => {
		let b = block('parent');

		should(
			b('child', {color: 'dark'}).toString()
		).equal('parent__child parent__child_color_dark');
		should(
			b('child', {color: 'dark', value: 'none'}).toString()
		).equal('parent__child parent__child_color_dark parent__child_value_none');
	});

	it('should create modifier without value', () => {
		let b = block('parent');

		should(
			b({value: true}).toString()
		).equal('parent parent_value');
	});

	it('should append mixed class', () => {
		let b = block('parent');
		let another = block('another');

		should(
			b.mix('outer').toString()
		).equal('parent outer');
		should(
			b('child').mix('outer').toString()
		).equal('parent__child outer');
		should(
			b('icon', {name: 'close'}).mix('another').toString()
		).equal('parent__icon parent__icon_name_close another');
		should(
			b.mix(['one', 'two']).toString()
		).equal('parent one two');
		should(
			b.mix(another).toString()
		).equal('parent another');
		should(
			b.mix(another('child')).toString()
		).equal('parent another__child');
		should(
			b.mix(another({color: 'dark'})).toString()
		).equal('parent another another_color_dark');
		should(
			b('icon', {name: 'close'}).mix(another({color: 'dark'})).toString()
		).equal('parent__icon parent__icon_name_close another another_color_dark');
	});
});

describe('Unexpected arguments', () => {
	it('should be silent when passed unexpected value', () => {
		let b = block('block');

		should(
			b(null).toString()
		).equal('block');
		should(
			b.mix(null).toString()
		).equal('block');
		should(
			b(null).mix(null).toString()
		).equal('block');
	});
});

describe('Method state()', () => {
	it('should set states', () => {
		let b = block('block');

		should(
			b.state({hidden: true}).toString()
		).equal('block is-hidden');
		should(
			b.state({hidden: false}).toString()
		).equal('block');
		should(
			b.state({hidden: 'non boolean value'}).toString()
		).equal('block is-hidden');
		should(
			b.state({hidden: true, error: true}).toString()
		).equal('block is-hidden is-error');
		should(
			b('element').state({hidden: true}).toString()
		).equal('block__element is-hidden');
		should(
			b({mod: 'value'}).state({hidden: true}).toString()
		).equal('block block_mod_value is-hidden');
	});
});

describe('Method is()', () => {
	it('should set states with is- prefix', () => {
		let b = block('block');

		should(
			b.is({hidden: true}).toString()
		).equal('block is-hidden');
		should(
			b.is({hidden: false}).toString()
		).equal('block');
		should(
			b.is({hidden: 'non boolean value'}).toString()
		).equal('block is-hidden');
		should(
			b.is({hidden: true, error: true}).toString()
		).equal('block is-hidden is-error');
		should(
			b('element').is({hidden: true}).toString()
		).equal('block__element is-hidden');
		should(
			b({mod: 'value'}).is({hidden: true}).toString()
		).equal('block block_mod_value is-hidden');
	});
});

describe('Method has()', () => {
	it('should set states with has- prefix', () => {
		let b = block('block');

		should(
			b.has({child: true}).toString()
		).equal('block has-child');
		should(
			b.has({child: false}).toString()
		).equal('block');
		should(
			b.has({child: 'non boolean value'}).toString()
		).equal('block has-child');
		should(
			b.has({child: true, footer: true}).toString()
		).equal('block has-child has-footer');
		should(
			b('element').has({child: true}).toString()
		).equal('block__element has-child');
		should(
			b({mod: 'value'}).has({child: true}).toString()
		).equal('block block_mod_value has-child');
	});
});

describe('Method setup()', () => {
	it('should set custom settings', () => {
		block.setup({
			ns: 'ns-',
			el: '~~',
			mod: '--',
			modValue: '-'
		});

		let b = block('block');

		should(
			b('element').toString()
		).equal('ns-block~~element');
		should(
			b({mod: 'value'}).toString()
		).equal('ns-block ns-block--mod-value');
		should(
			b({mod: true}).toString()
		).equal('ns-block ns-block--mod');
		should(
			b('element', {mod: 'value'}).toString()
		).equal('ns-block~~element ns-block~~element--mod-value');
	});
});

describe('Method reset()', () => {
	it('should reset custom settings', () => {
		block.setup({
			ns: 'ns-',
			el: '~~',
			mod: '--',
			modValue: '-'
		});

		let b = block('block');

		should(
			b('element', {mod: 'value'}).toString()
		).equal('ns-block~~element ns-block~~element--mod-value');

		block.reset();

		should(
			b('element', {mod: 'value'}).toString()
		).equal('block__element block__element_mod_value');
	});
});

describe('Method split()', () => {
	it('should work as String.prototype.split', () => {
		let b = block('block');

		should(b.split()).eql(['block']);
		should(b.split(' ')).eql(['block']);
		should(b.split('')).eql(['b', 'l', 'o', 'c', 'k']);
		should(b('element', {mod: 'value'}).split(' ')).eql(['block__element', 'block__element_mod_value']);
	});
});

describe('Call without arguments', () => {
	it('should return the same as toString()', () => {
		let b = block('block');

		should(
			b()
		).equal('block');
		should(
			b('icon')()
		).equal('block__icon');
		should(
			b('icon', {mod: 'value'})()
		).equal('block__icon block__icon_mod_value');
		should(
			b('icon')({mod: 'value'})()
		).equal('block__icon block__icon_mod_value');
		should(
			b('icon')({mod: 'value'}).is({loading: true})()
		).equal('block__icon block__icon_mod_value is-loading');
	});
});

describe('Block with class mapping', () => {
	let classMap = {
		button: 'index__button___F5evr',
		button_mod: 'index__button_mod___3tGjQ',
		button__text: 'index__button__text___3ggzc',
		button__text_inlined: 'index__text_inlined___3ggzc'
	};

	before(
		() => block.setup({classMap})
	);

	after(
		() => block.setup({classMap: null})
	);

	it('should return class for block name', () => {
		let b = block('button');

		should(b().toString()).equal(classMap.button);
		should(b.toString()).equal(classMap.button);
	});

	it('should properly set class for modifier', () => {
		let b = block('button')({mod: true});

		should(b().toString()).equal([classMap.button, classMap.button_mod].join(' '));
		should(b.toString()).equal([classMap.button, classMap.button_mod].join(' '));
	});

	it('should properly set class element', () => {
		let button = block('button'),
			text = button('text');

		should(text().toString()).equal(classMap.button__text);
		should(text.toString()).equal(classMap.button__text);
	});

	it('should properly set class element with modifier', () => {
		let button = block('button'),
			textMod = button('text')({inlined: true});

		should(textMod().toString()).equal([classMap.button__text, classMap.button__text_inlined].join(' '));
		should(textMod.toString()).equal([classMap.button__text, classMap.button__text_inlined].join(' '));
	});
});
