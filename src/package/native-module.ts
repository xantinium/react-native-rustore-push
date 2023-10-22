import { NativeModules } from 'react-native';

import type { RuStorePushResult } from './errors';

type Constants = {
	PUSH_LOGGER_TAG: string
	MESSAGING_SERVICE_TAG: string
}

export type NativeModuleEvent = {
	name: string
	data: string
};

type InitProps = {
	projectId: string
	useCustomLogger: boolean
	testModeEnabled: boolean
};

const LINKING_ERROR = 'The package \'react-native-rustore-push\' doesn\'t seem to be linked. Make sure: \n\n'
  + '- You rebuilt the app after installing the package\n'
  + '- You are not using Expo Go\n';

const PROXY = new Proxy({}, {
	get() {
		throw new Error(LINKING_ERROR);
	},
});

export const RuStorePushNativeModule = NativeModules.RuStorePush ?? PROXY;

export const RuStorePushModule = {
	async getConstants(): Promise<Constants> {
		return RuStorePushNativeModule.getConstants();
	},
	async init(props: InitProps): RuStorePushResult<string> {
		return RuStorePushNativeModule.init(props.projectId, props.useCustomLogger, props.testModeEnabled);
	},
	async checkPushAvailability(): RuStorePushResult<boolean> {
		return RuStorePushNativeModule.checkPushAvailability();
	},
	async getToken(): RuStorePushResult<string> {
		return RuStorePushNativeModule.getToken();
	},
	async deleteToken(): RuStorePushResult<undefined> {
		return RuStorePushNativeModule.deleteToken();
	},
	async subscribeToTopic(topic: string): RuStorePushResult<undefined> {
		return RuStorePushNativeModule.subscribeToTopic(topic);
	},
	async unsubscribeFromTopic(topic: string): RuStorePushResult<undefined> {
		return RuStorePushNativeModule.unsubscribeFromTopic(topic);
	},
};

export function parseEventData<EventDataType>(data: string): EventDataType | undefined {
	try {
		const eventData = JSON.parse(data);

		return eventData as EventDataType;
	} catch (err) {
		return undefined;
	}
}
