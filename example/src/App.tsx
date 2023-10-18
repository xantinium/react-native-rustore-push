import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import RuStorePush from 'react-native-rustore-push';
import * as Sentry from '@sentry/react-native';

import Button from './Button';
import LogsContainer, { ItemPropsTypes } from './LogsContainer';

Sentry.init({ 
    dsn: 'https://a16e365074464f1ca8b727569208a105@o1128349.ingest.sentry.io/4505031220461568', 
});


const App: React.FC = () => {
    const [projectID, setProjectID] = useState('M5Di1B5g0C5fHlKCe4oUnXZGtFFMJhMu');
    const [isInit, setIsInit] = useState(false);
    const [logs, setLogs] = useState<ItemPropsTypes[]>([]);

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev, {
            date: new Date().getTime(),
            text: msg,
        }]);
    };

    const onInit = useCallback(async () => {
        const res = await RuStorePush.init(projectID);
        if (res !== null) {
            addLog(res);
            return;
        }
        setIsInit(true);
        addLog('INITIALIZED');
    }, [projectID]);

    const onGetToken = useCallback(async () => {
        const res = await RuStorePush.getToken();
        console.log(res);
        if (res == null) return;
        addLog(res);
    }, []);
    
    const onCheck = useCallback(async () => {
        const res = await RuStorePush.checkPushAvailability();
        console.log(res);
        if (res == null) return;
        addLog(res);
    }, []);
    
    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    const onDelete = useCallback(async () => {
        // const res = await RuStorePush.deleteToken();
        // if (res == null) return;
        // addLog(res);
    }, []);

    useEffect(() => {
        return RuStorePush.addEventListener('service', (e) => console.log(e));
    }, []);

    return <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <TextInput
            value={projectID}
            onChangeText={setProjectID}
            style={{borderWidth: 1, margin: 16, borderRadius: 8, paddingHorizontal: 12, color: '#000000'}}
            placeholder='Project ID...'
        />
        <View style={{alignItems: 'center', height: 300, justifyContent: 'space-between'}}>
            <Button onPress={onInit} title='Инициализировать SDK' disabled={isInit || projectID.length === 0} />
            <Button onPress={onGetToken} title='Запросить токен' disabled={!isInit} />
            <Button onPress={onCheck} title='Проверка возможности получения пуш-уведомлений' disabled={!isInit} />
            <Button onPress={clearLogs} title='Очистить логи' />
            <Button onPress={onDelete} title='Удалить токен' disabled={!isInit} />
        </View>
        <LogsContainer logs={logs} />
    </View>;
};

export default Sentry.wrap(App);
