export type RuStorePushError = {
	/** Текст ошибки */
	msg: string
	/** Стек-трейс ошибки */
	stackTrace?: string
};

export type RuStorePushResult<Result> = Promise<Result | RuStorePushError>;

export function isError(obj: unknown): obj is RuStorePushError {
	return typeof obj === 'object' && obj !== null && 'msg' in obj;
}
