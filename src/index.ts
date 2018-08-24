import { assign } from './helpers'

export const ERROR_BLOCK_NAME_TYPE = 'Block name should be a string'
export const ERROR_BLOCK_NAME_EMPTY = 'Block name should be non-empty'

export interface BemSettings {
	ns?: string
	el: string
	mod: string
	modValue: string
	classMap?: Record<string, string>
}

export interface BemMods {
	[mod: string]: string | boolean | any
}

export type BemMix =
	| string
	| string[]
	| BemBlock
	| { toString: () => string }
	| undefined

export type BemItem = {
	is(state: BemState): BemItem & string
	has(state: BemState): BemItem & string
	state(state: BemState): BemItem & string
	split(separator?: string, limit?: number): BemItem & string
	mix(...mix: BemMix[]): BemItem & string
	toString(): string
}

interface BemBlock {
	(
		settings: BemSettings,
		context: BemContext,
		...elemNameOrMods: (string | BemMods)[]
	): BemItem | string
}

export type BemStatePrefix = 'is-' | 'has-'
export type BemState = Record<string, boolean>
export type BemStates = Record<BemStatePrefix, BemState>

interface BemContext {
	name: string
	mods: BemMods
	mixes: BemMix[]
	states: BemStates
}

export interface IBlock extends BemItem {
	(...elemNameOrMods: (string | BemMods)[]): BemItem & string
}

export type Block = IBlock & string

export interface BemCn {
	(blockName: string): Block
}

const isPrefix = 'is-' as 'is-'
const hasPrefix = 'has-' as 'has-'
const defaultSettings: BemSettings = {
	ns: '',
	el: '__',
	mod: '_',
	modValue: '_'
}

const isString = (nameOrMods: string | BemMods): nameOrMods is string =>
	typeof nameOrMods === 'string'

const isBemMods = (nameOrMods: string | BemMods): nameOrMods is BemMods =>
	typeof nameOrMods !== 'string'

const normilizeMixes = (mixes: BemMix[] = []): string[] => {
	return mixes
		.map(mix => {
			if (Array.isArray(mix)) {
				return mix.join(' ')
			} else if (typeof mix === 'object' && mix !== null) {
				return mix.toString()
			} else if (typeof mix === 'function') {
				return mix.toString()
			} else if (typeof mix === 'string') {
				return mix
			}

			return ''
		})
		.filter(mix => !!mix)
}

const mix = (
	settings: BemSettings,
	context: BemContext,
	...mixes: BemMix[]
): BemItem => {
	const copiedContext = assign({}, context)

	copiedContext.mixes = copiedContext.mixes.concat(mixes)
	return bemItem(copiedContext, settings)
}

const state = (
	settings: BemSettings,
	context: BemContext,
	prefix: BemStatePrefix,
	...states: BemStates[]
): BemItem => {
	const copiedContext = assign({}, context)
	const copiedState = assign({}, copiedContext.states || {})

	copiedState[prefix] = assign({}, copiedState[prefix] || {}, ...states)
	copiedContext.states = copiedState

	return bemItem(copiedContext, settings)
}

const split = (
	settings: BemSettings,
	context: BemContext,
	separator?: string,
	limit?: number
): string[] =>
	String.prototype.split.call(toString(settings, context), separator, limit)

const toString = (settings: BemSettings, context: BemContext) => {
	const { name, mods, mixes, states } = context
	let classes: string[] = [name]

	// Add list of modifiers
	if (mods) {
		classes = classes.concat(
			Object.keys(mods)
				.filter(key => mods[key]) // Don't add modifiers with falsy values
				.map(key => {
					const value = mods[key]

					// Modifier with only name
					if (value === true) {
						return name + settings.mod + key
						// Modifier with name and value
					} else {
						return (
							name +
							settings.mod +
							key +
							settings.modValue +
							value
						)
					}
				})
		)
	}

	// Add states
	if (states) {
		Object.keys(states).forEach(prefix => {
			const statesByPrefix = states[prefix]

			classes = classes.concat(
				Object.keys(statesByPrefix)
					.filter(key => statesByPrefix[key])
					.map(key => prefix + key)
			)
		})
	}

	// Add namespace
	if (settings.ns) {
		classes = classes.map(className => settings.ns + className)
	}

	// Add mixes (strongly after adding namespaces)
	if (mixes) {
		classes = classes.concat(normilizeMixes(mixes))
	}

	// Resolve class name from classMap
	if (settings.classMap) {
		const { classMap } = settings
		classes = classes.map(className => classMap[className] || className)
	}

	return classes.join(' ')
}

const bemItem = (context: BemContext, settings: BemSettings): BemItem => {
	return {
		mix: mix.bind(null, settings, context),
		split: split.bind(null, settings, context),
		is: state.bind(null, settings, context, isPrefix),
		has: state.bind(null, settings, context, hasPrefix),
		state: state.bind(null, settings, context, isPrefix),
		toString: toString.bind(null, settings, context)
	}
}

const bemBlock: BemBlock = (
	settings: BemSettings,
	context: BemContext,
	...args: (string | BemMods)[]
) => {
	// Is case of call without arguments return string representation
	if (!args.length) {
		return toString(settings, context)
	}

	const copiedContext = assign({}, context)

	const name = args
		.filter(isString)
		.reduce((acc, name) => acc + settings.el + name, '')

	if (name) {
		copiedContext.name = copiedContext.name + name
	}

	const mods = args
		.filter(isBemMods)
		.reduce((acc, mods) => assign(acc, mods), {} as BemMods)

	copiedContext.mods = assign({}, copiedContext.mods, mods)

	return bemItem(copiedContext, settings)
}

const factory = (name: string, settings: BemSettings) => {
	const context: BemContext = {
		name,
		mods: {},
		mixes: [],
		states: { 'is-': {}, 'has-': {} }
	}

	const boundBlock = bemBlock.bind(null, settings, context) as Block
	boundBlock.mix = mix.bind(null, settings, context)
	boundBlock.split = split.bind(null, settings, context)
	boundBlock.is = state.bind(null, settings, context, isPrefix)
	boundBlock.has = state.bind(null, settings, context, hasPrefix)
	boundBlock.state = state.bind(null, settings, context, isPrefix)
	boundBlock.toString = toString.bind(null, settings, context)

	return boundBlock
}

export const setup = (settings: Partial<BemSettings> = {}): BemCn => (
	blockName: string
) => {
	if (typeof blockName !== 'string') {
		throw new Error(ERROR_BLOCK_NAME_TYPE)
	}

	const name = blockName.trim()

	if (!name) {
		throw new Error(ERROR_BLOCK_NAME_EMPTY)
	}

	return factory(name, assign({}, defaultSettings, settings))
}

export const block = setup()

export default block
