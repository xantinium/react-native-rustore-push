import RuStorePushSDK from '../rustore-push';

const init = (projectID: string): Promise<string | null> => {
    return RuStorePushSDK.init(projectID);
};

export default init;