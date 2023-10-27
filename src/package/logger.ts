import { NativeEventEmitter } from 'react-native';

import type { RuStorePushError } from './errors';
import {
	RuStorePushModule, RuStorePushNativeModule, parseEventPayload, parseEvent,
} from './native-module';

type LogEventPayload = {
	msg: string
	error?: RuStorePushError
};

type LogFunc = (props: LogEventPayload) => void;

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

	ee.addListener(constants.PUSH_LOGGER_TAG, (event: string) => {
		const parsedEvent = parseEvent(event);

		if (parsedEvent && isKnownEvent(parsedEvent.name)) {
			const listener = listeners[parsedEvent.name];

			if (listener) {
				const eventData = parseEventPayload<LogEventPayload>(parsedEvent.payload);

				if (eventData !== undefined) {
					listener(eventData);
				}
			}
		}
	});
}
