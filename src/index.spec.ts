import * as should from 'should'
import block, {
	setup,
	ERROR_BLOCK_NAME_TYPE,
	ERROR_BLOCK_NAME_EMPTY
} from './index'

describe('Wrapper function block', () => {
	it('should be a function', () => {
		should(block).be.an.instanceOf(Function)
	})

	it('should expose a function setup', () => {
		should(setup).be.an.instanceOf(Function)
	})
})

describe('Block output', () => {
	it('should be a given block name', () => {
		const b = block('button')

		should(b).be.an.instanceOf(Function)
		should(b().toString()).equal('button')
		should(b.toString()).equal('button')
	})

	it('should have all necessary methods', () => {
		const b = block('button')

		should(b.is).be.an.instanceOf(Function)
		should(b.has).be.an.instanceOf(Function)
		should(b.mix).be.an.instanceOf(Function)
		should(b.state).be.an.instanceOf(Function)
		should(b.split).be.an.instanceOf(Function)
		should(b.toString).be.an.instanceOf(Function)
	})
})

describe('Block name', () => {
	it('should be a string', () => {
		should(() => {
			block(undefined as any)
		}).throw(ERROR_BLOCK_NAME_TYPE)
		should(() => {
			block(1 as any)
		}).throw(ERROR_BLOCK_NAME_TYPE)
		should(() => {
			block({} as any)
		}).throw(ERROR_BLOCK_NAME_TYPE)
		should(() => {
			block(true as any)
		}).throw(ERROR_BLOCK_NAME_TYPE)
		should(() => {
			block(null as any)
		}).throw(ERROR_BLOCK_NAME_TYPE)
	})

	it('should be non-empty string', () => {
		should(() => {
			block('')
		}).throw(ERROR_BLOCK_NAME_EMPTY)
	})

	it('should be trimmed', () => {
		should(() => {
			block(' ')
		}).throw(ERROR_BLOCK_NAME_EMPTY)

		should(block(' button ').toString()).equal('button')
	})
})

describe('Selector function', () => {
	it('should return elements class name', () => {
		const b = block('parent')

		should(b('child').toString()).equal('parent__child')
		should(b('child', 'infant').toString()).equal('parent__child__infant')
	})

	it('should return block with modifier', () => {
		const b = block('parent')

		should(b({ color: 'dark' }).toString()).equal(
			'parent parent_color_dark'
		)
		should(b({ color: 'dark', value: 'none' }).toString()).equal(
			'parent parent_color_dark parent_value_none'
		)
	})

	it('should not add some modifiers with the same name', () => {
		const b = block('parent')

		should(b({ skin: 'dark' }, { skin: 'light' }).toString()).equal(
			'parent parent_skin_light'
		)
		should(
			b('child', { skin: 'dark' }, { skin: 'light' }).toString()
		).equal('parent__child parent__child_skin_light')
	})

	it('should not add modifiers with falsy values', () => {
		const b = block('parent')

		should(b({ mod: 0 }).toString()).equal('parent')
		should(b({ mod: '' }).toString()).equal('parent')
		should(b({ mod: null }).toString()).equal('parent')
		should(b({ mod: false }).toString()).equal('parent')
		should(b({ mod: undefined }).toString()).equal('parent')
	})

	it('should return element modifier', () => {
		const b = block('parent')

		should(b('child', { color: 'dark' }).toString()).equal(
			'parent__child parent__child_color_dark'
		)
		should(b('child', { color: 'dark', value: 'none' }).toString()).equal(
			'parent__child parent__child_color_dark parent__child_value_none'
		)
	})

	it('should create modifier without value', () => {
		const b = block('parent')

		should(b({ value: true }).toString()).equal('parent parent_value')
	})

	it('should append mixed class', () => {
		const b = block('parent')
		const another = block('another')

		should(b.mix('outer').toString()).equal('parent outer')
		should(b.mix('parent2', 'parent3').toString()).equal(
			'parent parent2 parent3'
		)
		should(
			b('child')
				.mix('outer')
				.toString()
		).equal('parent__child outer')
		should(
			b('icon', { name: 'close' })
				.mix('another')
				.toString()
		).equal('parent__icon parent__icon_name_close another')
		should(b.mix(['one', 'two']).toString()).equal('parent one two')
		should(b.mix(another).toString()).equal('parent another')
		should(b.mix(another('child')).toString()).equal(
			'parent another__child'
		)
		should(b.mix(another({ color: 'dark' })).toString()).equal(
			'parent another another_color_dark'
		)
		should(
			b('icon', { name: 'close' })
				.mix(another({ color: 'dark' }))
				.toString()
		).equal(
			'parent__icon parent__icon_name_close another another_color_dark'
		)
	})
})
