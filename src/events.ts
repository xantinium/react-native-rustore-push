import { NativeEventEmitter } from 'react-native';

import RuStorePushSDK from './rustore-push';

type ListenerType = 'logger' | 'service';

type Constants = {
    PUSH_LOGGER_TAG: string
    MESSAGING_SERVICE_TAG: string
};

const ee = new NativeEventEmitter();

const constants: Constants = RuStorePushSDK.getConstants();

const addEventListener = (type: ListenerType, listener: (event: any) => void) => {
    const eventType = type === 'logger' ? constants.PUSH_LOGGER_TAG : constants.MESSAGING_SERVICE_TAG;
    const subscription = ee.addListener(eventType, listener);
    return () => ee.removeSubscription(subscription);
};

export default {
    addEventListener,
};
