import { RuStorePushModule } from './native-module';
import { type RuStorePushResult } from './errors';
import { RuStorePushErrors, isError } from './errors';
import MessagingService from './messaging-service';
import { type RuStorePushLoggerProps } from './logger';
import { initRuStorePushLogger } from './logger';

export type RuStorePushProps = {
	/** ID проекта */
	projectId: string
	/**
	 * Конфигурация для логгера.
	 * Передача значения подразумевает, что вместо **Logcat** будет использоваться логгер из данного пакета.
	 */
    loggerProps?: RuStorePushLoggerProps
	/** Нужно ли инициализировать **RuStore SDK** пуш-уведомлений в режиме E2E-тестирования. По умолчанию `false`. */
    testModeEnabled?: boolean
};

/** Класс для работы с **RuStore SDK** пуш-уведомлений **RuStore** */
export class RuStorePush {
	private projectId: string;

	private testModeEnabled: boolean;

	private loggerProps?: RuStorePushLoggerProps;

	private isInit: boolean;

	/** Объект для получения данных от **RuStore SDK** */
	readonly messagingService: MessagingService;

	constructor(props: RuStorePushProps) {
		this.isInit = false;
		this.projectId = props.projectId;
		this.testModeEnabled = props.testModeEnabled ?? false;
		this.loggerProps = props.loggerProps;
		this.messagingService = new MessagingService();
	}

	private async withInitChech<Result>(callback: () => RuStorePushResult<Result>): RuStorePushResult<Result> {
		if (!this.isInit) {
			return {
				err: RuStorePush.Errors.SDK_NOT_INITIALIZED,
			};
		}

		return callback();
	}

	/** Инициализировать **RuStore SDK** пуш-уведомлений. Побочным эффектом является получение пуш-токена. */
	async init(): RuStorePushResult<string> {
		if (this.isInit) {
			return {
				err: RuStorePush.Errors.SDK_ALREADY_INITIALIZED,
			};
		}

		const result = await RuStorePushModule.init({
			projectId: this.projectId,
			useCustomLogger: this.loggerProps !== undefined,
			testModeEnabled: this.testModeEnabled,
		});

		if (RuStorePush.isError(result)) {
			return result;
		}

		this.isInit = true;

		if (this.loggerProps !== undefined) {
			initRuStorePushLogger(this.loggerProps);
		}

		return result;
	}

	/** Проверить возможность получения пуш-уведомлений. */
	async checkPushAvailability(): RuStorePushResult<boolean> {
		const callback = RuStorePushModule.checkPushAvailability;

		return this.withInitChech(callback);
	}

	/** Получить текущий пуш-токен. Если пуш-токен отсутствует, то метод создаст и вернёт новый пуш-токен. */
	async getToken(): RuStorePushResult<string> {
		const callback = RuStorePushModule.getToken;

		return this.withInitChech(callback);
	}

	/** Удалить текущий пуш-токен. */
	async deleteToken(): RuStorePushResult<undefined> {
		const callback = RuStorePushModule.deleteToken;

		return this.withInitChech(callback);
	}

	/**
	 * Подписаться на пуш-топик.
	 * @param topic Название пуш-топика
	 */
	async subscribeToTopic(topic: string): RuStorePushResult<undefined> {
		const callback = () => RuStorePushModule.subscribeToTopic(topic);

		return this.withInitChech(callback);
	}

	/**
	 * Отписаться от пуш-топика.
	 * @param topic Название пуш-топика
	 */
	async unsubscribeFromTopic(topic: string): RuStorePushResult<undefined> {
		const callback = () => RuStorePushModule.unsubscribeFromTopic(topic);

		return this.withInitChech(callback);
	}

	/** Список возможных ошибок */
	static readonly Errors = RuStorePushErrors;

	/** Вспомогательная функция: определяет, является ли переданная структура ошибкой. */
	static readonly isError = isError;
}
