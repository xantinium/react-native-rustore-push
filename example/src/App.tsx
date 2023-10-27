import React from 'react';
import {
	View, Button, PermissionsAndroid, Platform,
} from 'react-native';
import RuStorePush from 'react-native-rustore-push';

function log(msg: unknown) {
	// eslint-disable-next-line no-console
	console.log(msg);
}

const TEST_MODE_ENABLED = false;

const ruStorePush = new RuStorePush({
	projectId: 'P3QOyAAXksYtwWGMZax0Iw7KbuVIQd3B',
	loggerProps: {
		verbose(props) {
			log(props);
		},
		info(props) {
			log(props);
		},
		error(props) {
			log(props);
		},
		debug(props) {
			log(props);
		},
		warn(props) {
			log(props);
		},
	},
	testModeEnabled: TEST_MODE_ENABLED,
});

ruStorePush.messagingService.on('new-token', (data) => {
	log(data);
});
ruStorePush.messagingService.on('message-received', (data) => {
	log(data);
});
ruStorePush.messagingService.on('deleted-messages', (data) => {
	log(data);
});
ruStorePush.messagingService.on('error', (data) => {
	log(data);
});

function App() {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#ffffff',
				paddingHorizontal: 16,
				justifyContent: 'space-evenly',
			}}
		>
			<Button
				title="Инициализировать RuStore SDK"
				onPress={() => {
					ruStorePush.init().then((result) => {
						log(result);
					});
				}}
			/>
			<Button
				title="Проверить возможность получения пуш-уведомлений"
				onPress={() => {
					ruStorePush.checkPushAvailability().then((result) => {
						log(result);
					});
				}}
			/>
			<Button
				title="Получить токен"
				onPress={() => {
					ruStorePush.getToken().then((result) => {
						log(result);
					});
				}}
			/>
			<Button
				title="Удалить токен"
				onPress={() => {
					ruStorePush.deleteToken().then((result) => {
						log(result);
					});
				}}
			/>
			<Button
				title="Подписаться на пуш-топик"
				onPress={() => {
					ruStorePush.subscribeToTopic('test').then((result) => {
						log(result);
					});
				}}
			/>
			<Button
				title="Отписаться от пуш-топика"
				onPress={() => {
					ruStorePush.unsubscribeFromTopic('test').then((result) => {
						log(result);
					});
				}}
			/>
			{TEST_MODE_ENABLED && (
				<Button
					title="Отправить тестовое пуш-уведомление"
					onPress={() => {
						ruStorePush.sendTestNotification({
							title: 'test title',
							body: 'test body',
							data: {
								roomId: '123',
							},
						}).then((result) => {
							log(result);
						});
					}}
				/>
			)}
			{Number(Platform.Version) >= 33 && (
				<Button
					title="Запросить разрешение на пуши"
					onPress={async () => {
						const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

						if (permission) {
							const status = await PermissionsAndroid.request(permission, {
								title: 'Дай',
								message: 'Мне',
								buttonNeutral: 'Потом',
								buttonNegative: 'Нет',
								buttonPositive: 'Да',
							});

							log(status);
						}
					}}
				/>
			)}
		</View>
	);
}

export default App;
