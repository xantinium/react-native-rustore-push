// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/extensions
const pak = require('../package.json');

module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				extensions: ['.tsx', '.ts', '.js', '.json'],
				alias: {
					[pak.name]: path.join(__dirname, '..', pak.source),
				},
			},
		],
	],
};
