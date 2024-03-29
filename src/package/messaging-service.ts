import { NativeEventEmitter } from 'react-native';

import {
	RuStorePushModule, RuStorePushNativeModule, parseEventPayload, parseEvent,
} from './native-module';

/** Приоритет пуш-уведомления */
enum Priority {
	UNKNOWN,
	HIGH,
	NORMAL,
}

/** Пуш-токен */
type Token = string;

type Notification = {
	/** Заголовок уведомления */
    title?: string
	/** Тело уведомления */
    body?: string
	/** Канал, в который будет отправлено уведомление (актуально для Android 8.0 и выше) */
    channelId?: string
	/** Прямая ссылка на изображение для вставки в уведомление (изображение должно быть не более 1 мегабайта) */
    imageUrl?: string
	/** Цвет уведомления. Цвет необходимо передать в hex-формате (например `"#A52A2A"`) */
    color?: string
	/**
	 * Иконка уведомления. Иконка должна лежать в ресурсах приложения (`res/drawable`).
	 *
	 * Пример: в `res/drawable` лежит иконка `small_icon.xml`.
	 * Для отображения данной иконки в уведомлении сервер должен поместить в параметр `icon` значение `"small_icon"`.
	 */
    icon?: string
	/** Intent action, с помощью которого будет открыта активити при нажатии на уведомление (не поддерживается данным пакетом) */
    clickAction?: string
}

type RemoteMessage = {
	/** Уникальный ID сообщения. Является идентификатором каждого сообщения. */
    messageId?: string
	/** Значение приоритетности (на данный момент не учитывается) */
    priority: Priority
	/** Время жизни пуш-уведомления в секундах */
    ttl: number
	/** Идентификатор группы уведомлений (на данный момент не учитывается) */
    collapseKey?: string
	/** Объект с дополнительными данными */
    data: Record<string, string>
	/** Содержимое объекта `data` в бинарном виде  */
    rawData?: ArrayBuffer
	/** Объект уведомления */
    notification?: Notification
}

type EventListeners = {
	'new-token': Token
	'message-received': RemoteMessage
	'deleted-messages': null
	'error': string[]
};

type EventName = keyof EventListeners;

type EventListenerObject<Name extends EventName> = {
	name: Name
	handler(data: EventListeners[Name]): void
};

type UnsubscribeFunction = () => void;

class MessagingService {
	private listeners: Array<EventListenerObject<EventName>>;

	private ee: NativeEventEmitter;

	constructor() {
		this.listeners = [];
		this.ee = new NativeEventEmitter(RuStorePushNativeModule);

		this.init();
	}

	private async init() {
		const constants = await RuStorePushModule.getConstants();

		this.ee.addListener(constants.MESSAGING_SERVICE_TAG, (event: string) => {
			const parsedEvent = parseEvent(event);

			if (parsedEvent) {
				this.listeners.forEach((listener) => {
					const { name, handler } = listener;

					if (parsedEvent.name === name) {
						const payload = parseEventPayload<EventListeners[typeof name]>(parsedEvent.payload);

						if (payload !== undefined) {
							handler(payload);
						}
					}
				});
			}
		});
	}

	/**
	 * Добавить обработчик на событие получения данных от **RuStore SDK**.
	 *
	 * Имеется четыре вида обработчиков событий:
	 *
	 * 1. **`new-token`** - будет вызван при получении нового пуш-токена.
	 * После вызова данного метода ваше приложение ответственно за то, чтобы передать новый пуш-токен на свой серве.
	 *
	 * 2. **`message-received`** - будет вызван при получении нового пуш-уведомления.
	 * Если в объекте `notification` есть данные, то **RuStore SDK** сама отобразит уведомление.
	 * Если вы не хотите, чтобы **RuStore SDK** самостоятельно отображала уведомление,
	 * то используйте объект `data`, а объект `notification` оставляйте пустым.
	 * Однако сам обработчик будет вызван в любом случае.
	 * Получить полезную нагрузку пуш-уведомления можно из поля `data`.
	 *
	 * 3. **`deleted-messages`** - будет вызван в случае, если одно или несколько пуш-уведомлений не были доставлены на устройство.
	 * Это может произойти, например, по причине истечения времени жизни уведомления до того, как оно будет доставлено на устройство.
	 * При вызове этого метода рекомендуется синхронизироваться со своим сервером, чтобы не пропустить данные.
	 *
	 * 4. **`error`** - будет вызван при возникновении ошибки в момент инициализации.
	 * @param event Имя события
	 * @param listener Обработчик
	 * @returns Функция для уничтожения созданного обработчика
	 */
	on<Event extends EventName>(event: Event, listener: (data: EventListeners[Event]) => void) {
		const listenerObj: EventListenerObject<Event> = {
			name: event,
			handler: listener,
		};

		this.listeners.push(listenerObj);

		const unsubscribe: UnsubscribeFunction = () => {
			this.listeners = this.listeners.filter((el) => el !== listenerObj);
		};

		return unsubscribe;
	}

	/** Уничтожить все обработчики событий. */
	unsubscribeAll() {
		this.listeners = [];
	}
}

export default MessagingService;
