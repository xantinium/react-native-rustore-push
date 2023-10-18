import RuStorePushSDK from '../rustore-push';

const getToken = (): Promise<string | null> => {
    return RuStorePushSDK.getToken();
};

const deleteToken = (): Promise<string | null> => {
    return RuStorePushSDK.deleteToken();
};

export default {
    getToken,
    deleteToken,
};
