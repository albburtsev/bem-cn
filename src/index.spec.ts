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

		// should(b.is).be.an.instanceOf(Function)
		// should(b.has).be.an.instanceOf(Function)
		should(b.mix).be.an.instanceOf(Function)
		should(b.state).be.an.instanceOf(Function)
		// should(b.split).be.an.instanceOf(Function)
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
