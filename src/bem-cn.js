/**
 * How it's working?
 * The essential part of this module is based on using currying pattern.
 * Just take a look at the interface:
 * 
 * @example
const selector = (settings, context) => {
	const inner = () => {
		return selector(...);
	};

	inner.toString = inner.valueOf = () => {
		// ...
	}

	// ...

	return inner;
};

const block = (settings) => {
	// ...

	return selector(settings);
};
 */
const selector = (settings, context) => {
	const inner = () => {
		// @todo
		return selector(/* @todo */);
	};

	inner.toString = inner.valueOf = () => {
		// @todo
	};

	inner.mix = () => {
		// @todo
	};

	inner.state = () => {
		// @todo
	};

	return inner;
};

const block = (settings) => {
	// @todo defaultSettings

	block.setup = () => {
		// @todo
	};

	block.reset = () => {
		// @todo
	};

	return selector(settings);
};

export default block;
