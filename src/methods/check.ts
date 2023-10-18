import RuStorePushSDK from '../rustore-push';

const checkPushAvailability = (): Promise<string | null> => {
    return RuStorePushSDK.checkPushAvailability();
};

export default checkPushAvailability;
