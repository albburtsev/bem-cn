import { assign } from './helpers'

export const ERROR_BLOCK_NAME_TYPE = 'Block name should be a string'
export const ERROR_BLOCK_NAME_EMPTY = 'Block name should be non-empty'

export interface BemSettings {
	ns?: string
	el?: string
	mod?: string
	modValue?: string
}

export interface BemMods {
	[mod: string]: string | boolean | any
}

export type BemMix = BemItem | string | string[]

export type BemItem = {
	state(state: BemStates): BemItem & string
	mix(mix: BemMix | null | undefined): BemItem & string
	toString(): string
}

interface BemBlock {
	(
		settings: BemSettings,
		context: BemContext,
		elemName: string,
		...modsArray: BemMods[]
	): BemItem
	(
		settings: BemSettings,
		context: BemContext,
		...modsArray: BemMods[]
	): BemItem
}

export interface BemStates {
	[stateKey: string]: boolean
}

interface BemContext {
	name: string
	mods: BemMods
	mixes: BemMix[]
	states: BemStates
}

export interface IBlock extends BemItem {
	(elemName: string, ...mods: BemMods[]): BemItem & string
	(...mods: BemMods[]): BemItem & string
}

export type Block = IBlock & string

export interface BemCn {
	(blockName: string): Block
}

const is = 'is-'
const defaultSettings: BemSettings = {
	ns: '',
	el: '__',
	mod: '_',
	modValue: '_'
}

const normilizeMixes = (mixes: BemMix[] = []): string[] => {
	return mixes
		.map(mix => {
			if (Array.isArray(mix)) {
				return mix.join(' ')
			} else if (typeof mix === 'object' && mix !== null) {
				return mix.toString()
			} else if (typeof mix === 'string') {
				return mix
			}

			return ''
		})
		.filter(mix => mix)
}

const mix = (
	settings: BemSettings,
	context: BemContext,
	mixes: BemMix
): BemItem => {
	const copiedContext = assign({}, context)

	copiedContext.mixes = copiedContext.mixes.concat(mixes)
	return bemItem(copiedContext, settings)
}

const state = (
	settings: BemSettings,
	context: BemContext,
	states: BemStates
): BemItem => {
	const copiedContext = assign({}, context)

	copiedContext.states = assign({}, copiedContext.states, states)
	return bemItem(copiedContext, settings)
}

const toString = (settings: BemSettings, context: BemContext) => {
	const { name, mods, mixes, states } = context
	let classes: string[] = [name]

	// Add list of modifiers
	if (mods) {
		classes = classes.concat(
			Object.keys(mods)
				.filter(key => mods[key] && key.indexOf('@mix') === -1)
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
		classes = classes.concat(
			Object.keys(states)
				.filter(key => states[key])
				.map(key => is + key)
		)
	}

	// Add namespace
	if (settings.ns) {
		classes = classes.map(className => settings.ns + className)
	}

	// Add special theme modifiers
	classes = classes.concat(
		Object.keys(mods)
			.filter(key => key.indexOf('@mix') !== -1)
			.map(key => mods[key])
	)

	// Add mixes (strongly after adding namespaces)
	if (mixes) {
		classes = classes.concat(normilizeMixes(mixes))
	}

	return classes.join(' ')
}

const bemItem = (context: BemContext, settings: BemSettings): BemItem => {
	return {
		mix: mix.bind(null, settings, context),
		state: state.bind(null, settings, context),
		toString: toString.bind(null, settings, context)
	}
}

const bemBlock: BemBlock = (
	settings: BemSettings,
	context: BemContext,
	nameOrMod?: string | BemMods,
	...args: BemMods[]
) => {
	const copiedContext = assign({}, context)
	const elemName = typeof nameOrMod === 'string' ? nameOrMod : ''
	const modsArray =
		typeof nameOrMod === 'string' ? args : [nameOrMod, ...args]

	if (elemName) {
		copiedContext.name = copiedContext.name + settings.el + elemName
	}

	modsArray.forEach(mods => {
		copiedContext.mods = assign({}, copiedContext.mods, mods)
	})

	return bemItem(copiedContext, settings)
}

export const setup = (settings: BemSettings = {}): BemCn => {
	const copiedSettings = assign({}, defaultSettings, settings)
	const blockFactory = (_context: Partial<BemContext> = {}) => {
		const context: BemContext = assign(
			{
				name: '',
				mods: {},
				mixes: [],
				states: {}
			},
			_context
		)

		const boundBlock = bemBlock.bind(null, copiedSettings, context)
		boundBlock.mix = mix.bind(null, copiedSettings, context)
		boundBlock.state = state.bind(null, copiedSettings, context)
		boundBlock.toString = toString.bind(null, copiedSettings, context)

		return boundBlock
	}

	return (blockName: string) => {
		if (typeof blockName !== 'string') {
			throw new Error(ERROR_BLOCK_NAME_TYPE)
		}

		const name = blockName.trim()

		if (!name) {
			throw new Error(ERROR_BLOCK_NAME_EMPTY)
		}

		return blockFactory({ name })
	}
}

export const block = setup()

export default block
