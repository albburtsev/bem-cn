export interface Fake {
	a: string
	b: string
}

export class Fake implements Fake {
	a = 'a'
	b = 'b'
}
