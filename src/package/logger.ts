import { NativeEventEmitter } from 'react-native';

import { type NativeModuleEvent } from './native-module';
import { RuStorePushModule, RuStorePushNativeModule, parseEventData } from './native-module';

type LogEventData = {
	message: string
	stackTrace: string
};

type LogFunc = (props: LogEventData) => void;

export type RuStorePushLoggerProps = {
	verbose?: LogFunc
	debug?: LogFunc
	info?: LogFunc
	warn?: LogFunc
	error?: LogFunc
};

type EventName = keyof RuStorePushLoggerProps;

const EVENTS: Array<EventName> = [
	'verbose',
	'debug',
	'info',
	'warn',
	'error',
];

function isKnownEvent(eventName: string): eventName is EventName {
	return (EVENTS as Array<string>).includes(eventName);
}

export async function initRuStorePushLogger(props: RuStorePushLoggerProps) {
	const listeners = props;

	const constants = await RuStorePushModule.getConstants();

	const ee = new NativeEventEmitter(RuStorePushNativeModule);

	ee.addListener(constants.PUSH_LOGGER_TAG, (event: NativeModuleEvent) => {
		if (isKnownEvent(event.name)) {
			const listener = listeners[event.name];

			if (listener) {
				const eventData = parseEventData<LogEventData>(event.data);

				if (eventData !== undefined) {
					listener(eventData);
				}
			}
		}
	});
}
