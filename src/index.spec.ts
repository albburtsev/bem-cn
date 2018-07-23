import * as should from 'should'
import { Fake } from './index'

describe('fake test', () => {
	it('should be a function', () => {
		const fake = new Fake()
		should(fake).be.an.instanceOf(Fake)
	})
})
