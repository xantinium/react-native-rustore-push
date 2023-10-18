// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line import/extensions, @typescript-eslint/no-var-requires
const pak = require('../package.json');

module.exports = {
	dependencies: {
		[pak.name]: {
			root: path.join(__dirname, '..'),
		},
	},
};
