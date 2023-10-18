import { NativeModules } from 'react-native';

const LINKING_ERROR = 'The package \'react-native-rustore-push\' doesn\'t seem to be linked. Make sure: \n\n'
  + '- You rebuilt the app after installing the package\n'
  + '- You are not using Expo Go\n';

const PROXY = new Proxy({}, {
	get() {
		throw new Error(LINKING_ERROR);
	},
});

const RustorePush = NativeModules.RNRustorePush ?? PROXY;

export default RustorePush;
