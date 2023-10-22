export enum RuStorePushErrors {
	/** Неизвестный тип ошибки */
	UNKNOWN_ERROR,
	/** **RuStore SDK** пуш-уведомлений уже инициализировано */
	SDK_ALREADY_INITIALIZED,
	/** Приложение **RuStore** не установлено на устройстве */
	RUSTORE_NOT_INSTALLED,
	/** Приложение **RuStore** не поддерживает функциональность пуш-уведомлений */
	RUSTORE_OUTDATED,
	/** У приложения **RuStore** нет разрешения на работу в фоновом режиме */
	RUSTORE_NO_BACKGROUND_WORK_PERMISSION,
	/** Пользователь не авторизован в приложении **RuStore** */
	RUSTORE_UNAUTHORIZED,
	/** Отпечаток подписи приложения не совпадает с отпечатком, добавленным в консоль разработчика */
	APP_SIGNATURE_MISMATCH,
	/** **RuStore SDK** пуш-уведомлений не инициализировано */
	SDK_NOT_INITIALIZED,
}

type RuStorePushError = {
	/** Идентификатор ошибки */
	err: RuStorePushErrors
	/** Текст ошибки. Как правило, это строка содержащая стек-трейс из **RuStore SDK** */
	err_text?: string
};

export type RuStorePushResult<Result> = Promise<Result | RuStorePushError>;

export function isError(obj: unknown): obj is RuStorePushError {
	return typeof obj === 'object' && obj !== null && 'err' in obj;
}
