import { NativeModules } from 'react-native';

import type { RuStorePushResult } from './errors';

type Constants = {
	PUSH_LOGGER_TAG: string
	MESSAGING_SERVICE_TAG: string
}

export type NativeModuleEvent = {
	name: string
	payload: string
};

type InitProps = {
	projectId: string
	useCustomLogger: boolean
	testModeEnabled: boolean
};

export type NotificationPayload = {
	/** Заголовок уведомления */
	title?: string
	/** Тело уведомления */
	body?: string
	/** Ссылка на изображение */
	imgUrl?: string
	/** Объект с дополнительными данными */
	data?: Record<string, string>
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
	async init(props: InitProps): RuStorePushResult<null> {
		return RuStorePushNativeModule.init(props.projectId, props.useCustomLogger, props.testModeEnabled);
	},
	async checkPushAvailability(): RuStorePushResult<boolean> {
		return RuStorePushNativeModule.checkPushAvailability();
	},
	async getToken(): RuStorePushResult<string> {
		return RuStorePushNativeModule.getToken();
	},
	async deleteToken(): RuStorePushResult<null> {
		return RuStorePushNativeModule.deleteToken();
	},
	async subscribeToTopic(topic: string): RuStorePushResult<null> {
		return RuStorePushNativeModule.subscribeToTopic(topic);
	},
	async unsubscribeFromTopic(topic: string): RuStorePushResult<null> {
		return RuStorePushNativeModule.unsubscribeFromTopic(topic);
	},
	async sendTestNotification(notificationPayload: NotificationPayload): RuStorePushResult<null> {
		return RuStorePushNativeModule.sendTestNotification(notificationPayload);
	},
};

function isNativeModuleEvent(event: unknown): event is NativeModuleEvent {
	return !(
		typeof event !== 'object'
		|| event === null
		|| !('name' in event)
		|| !('payload' in event)
		|| typeof event.name !== 'string'
		|| typeof event.payload !== 'string'
	);
}

export function parseEvent(event: string): NativeModuleEvent | undefined {
	try {
		const parsedEvent = JSON.parse(event);

		if (isNativeModuleEvent(parsedEvent)) {
			return {
				name: parsedEvent.name,
				payload: parsedEvent.payload,
			};
		}
	} catch (err) {
		return undefined;
	}

	return undefined;
}

export function parseEventPayload<EventPayloadType>(payload: string): EventPayloadType | undefined {
	try {
		const parsedPayload = JSON.parse(payload);

		return parsedPayload as EventPayloadType;
	} catch (err) {
		return undefined;
	}
}
