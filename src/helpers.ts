/**
 * Copies all enumerable properties from given source objects to target
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
export function assign<T, U>(target: T, source: U): T & U
export function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V
export function assign(target: object, ...sources: any[]): any
export function assign(target, ...args) {
	for (let i = 0; i < args.length; i++) {
		let source = args[i]
		for (let key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key]
			}
		}
	}

	return target
}
