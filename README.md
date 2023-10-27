# react-native-rustore-push

Имплементация RuStore SDK пуш-уведомлений для React Native.

> Используемая версия SDK: `1.0.0`

> Пакет находится в разработке. Предположительная дата релиза `16.11.2023`

Пример с использованием пакета находиться в директории [example](./example/).

## Установка

Для начала необходимо установить npm-пакет:

```bash
# установка с помощью yarn:
yarn add react-native-rustore-push

# установка с помощью npm:
npm install react-native-rustore-push
```

Далее, требуется указать ссылку на репозиторий, из которого будут получены все необходимые зависимости. Добавьте следующий код в файл `android/build.gradle` (не перепутать с `android/app/build.gradle`);

```gradle
buildscript {
    // ...
}

// Добавьте всё, что ниже

allprojects {
    repositories {
        maven {
            url = uri("https://artifactory-external.vkpartner.ru/artifactory/maven")
        }
    }
}
```

Заключительным этапом является объявление сервиса для получения данных от SDK:

```xml
<application>
 <!-- Добавьте всё, что ниже -->
    <service
        android:name="ru.reactnativerustorepush.deps.MessagingService"
        android:exported="true"
        tools:ignore="ExportedService">
        <intent-filter>
            <action android:name="ru.rustore.sdk.pushclient.MESSAGING_EVENT" />
        </intent-filter>  
    </service>
</application>
```

## Условия работы

Для работы пуш-уведомлений необходимо соблюдение следующих условий:

1. На устройстве пользователя должно быть установлено приложение RuStore.
2. Приложение RuStore должно поддерживать функциональность пуш-уведомлений.
3. Приложению RuStore разрешен доступ к работе в фоновом режиме.
4. Пользователь должен быть авторизован в приложении RuStore.
5. Отпечаток подписи приложения должен совпадать с отпечатком, добавленным в консоль разработчика.

## Использование

Для работы с пуш-уведомлениями понадобиться ID проекта, который можно получить в системе [RuStore Консоль](https://console.rustore.ru/waiting]). Для этого на странице приложения перейдите в раздел «Push-уведомления» и выберите «Проекты».

Все взаимодействия с SDK пушей производятся через экспортируемый по дефолту класс `RuStorePush`:

```typescript
import RuStorePush from 'react-native-rustore-push';
```

### Инициализация

Для взаимодействия с SDK пуш-уведомлений требуется создать инстанс класса `RuStorePush`, передав в конструктор необходимые параметры.

```typescript
const ruStorePush = new RuStorePush({
    projectId: '<ID_ПРОЕКТА>',
});
```

Имеются следующие опциональные параметры:

- Параметр `loggerProps` может быть использован для [логирования событий](#логирование-событий);

- Параметр `testModeEnabled` может быть использован для [E2E-тестирования](#e2e-тестирование).

Далее, необходимо вызвать метод `init`:

```typescript
ruStorePush.init()
```

Данный метод следует вызвать единожды при запуске приложения. Дальнейшие вызовы не возымеют эффекта.

### Получение данных

Для того, чтобы подписаться на получение данных от SDK, необходимо обратиться к полю `messagingService`, имеющееся у инстанса класса `RuStorePush`. Данное поле имеет две функции для работы с подписками:

- `on` - функция для подписки на событие получения данных;

- `unsubscribeAll` - функция для глобальной отписки от всех событий.

Об имеющихся событиях и формает получаемых данных можно ознакомиться в соответствующем разделе документации: [Получение данных от RuStore SDK](https://help.rustore.ru/rustore/for_developers/developer-documentation/sdk_push-notifications/RuStore-SDK-push-notifications/Getting-data-from-RuStoreSDK).

### Обработка ошибок

Каждый метод класса `RuStorePush` возвращает [Promise](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise), который может содержать либо данные, полученные после выполнения соответсвующего метода SDK, либо объект ошибки.

Структура объекта ошибки:

```typescript
type RuStorePushError = {
	/** Текст ошибки */
	msg: string
	/** Стек-трейс ошибки */
	stackTrace?: string
};
```

### Логирование событий

Для логирования событий в конструктор класса `RuStorePush` требуется передать параметр `loggerProps`, который содержит функции для обработки необходимых событий:

```typescript
type LogEventPayload = {
	msg: string
	error?: RuStorePushError
};

type LogFunc = (props: LogEventPayload) => void;

type RuStorePushLoggerProps = {
	verbose?: LogFunc
	debug?: LogFunc
	info?: LogFunc
	warn?: LogFunc
	error?: LogFunc
};
```

Пример использования:

```typescript
const ruStorePush = new RuStorePush({
    projectId: '<ID_ПРОЕКТА>',
    loggerProps: {
        info: ({ msg }) => {
            console.log(msg);
        },
    },
});
```

### E2E-тестирование

Для E2E тестирования нужно включить тестовый режим, а именно передать параметр `testModeEnabled`:

```typescript
const ruStorePush = new RuStorePush({
    projectId: '<ID_ПРОЕКТА>',
    testModeEnabled: true,
});
```

Далее, необходимо вызвать метод `sendTestNotification`, передав в него параметры пущ-уведомления. Пример:

```typescript
ruStorePush.sendTestNotification({
    title: 'Заголовок',
    body: 'Содержимое',
});
```

## Лицензия

MIT
