package ru.reactnativerustorepush

import android.content.Intent
import android.content.Context
import android.app.Application
import android.content.IntentFilter
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

import ru.reactnativerustorepush.deps.PushLogger
import ru.reactnativerustorepush.deps.Constants
import ru.reactnativerustorepush.deps.MessagingService
import ru.reactnativerustorepush.deps.convertReadableMap
import ru.reactnativerustorepush.deps.MessagingReceiver
import ru.reactnativerustorepush.deps.createError
import ru.rustore.sdk.pushclient.common.logger.Logger
import ru.rustore.sdk.pushclient.RuStorePushClient
import ru.rustore.sdk.core.tasks.OnCompleteListener
import ru.rustore.sdk.core.feature.model.FeatureAvailabilityResult
import ru.rustore.sdk.pushclient.messaging.model.TestNotificationPayload

class RuStorePushModule(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

	var initialized = false

    fun log(tag: String, msg: String) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(tag, msg)
    }

	@ReactMethod
	fun init(project_id: String, useLogger: Boolean, testMode: Boolean, promise: Promise) {
		if (initialized) {
            promise.resolve(createError("Package inner error"))
            return
        }

        var app = this.getCurrentActivity()?.getApplication()

        if (app == null) {
            promise.resolve(createError("Package inner error"))
            return
        }

        initialized = true

        reactContext.startService(Intent(reactContext, MessagingService::class.java))
        reactContext.registerReceiver(MessagingReceiver(::log), IntentFilter(Constants.MESSAGING_SERVICE_TAG))

        if (useLogger) {
            val logger = PushLogger(Constants.PUSH_LOGGER_TAG)

            logger.setLogFunc(::log)

            RuStorePushClient.init(
                application = app,
                projectId = project_id,
                testModeEnabled = testMode,
                logger = logger,
            )
        } else {
            RuStorePushClient.init(
                application = app,
                projectId = project_id,
                testModeEnabled = testMode,
            )
        }

        promise.resolve(null)
	}

    @ReactMethod
    fun checkPushAvailability(promise: Promise) {
        RuStorePushClient.checkPushAvailability().addOnCompleteListener(object : OnCompleteListener<FeatureAvailabilityResult>{
            override fun onSuccess(result: FeatureAvailabilityResult) {
                when (result) {
                    FeatureAvailabilityResult.Available -> {
                        promise.resolve(true)
                    }

                    is FeatureAvailabilityResult.Unavailable -> {
                        promise.resolve(createError(result.cause.toString()))
                    }
                }
            }

            override fun onFailure(throwable: Throwable) {
                promise.resolve(createError(throwable.message.toString(), throwable.getStackTrace().toString()))
            }
        })
    }

    @ReactMethod
    fun getToken(promise: Promise) {
        RuStorePushClient.getToken().addOnCompleteListener(object : OnCompleteListener<String>{
            override fun onFailure(throwable: Throwable) {
                promise.resolve(createError(throwable.message.toString(), throwable.getStackTrace().toString()))
            }

            override fun onSuccess(token: String) {
                promise.resolve(token)
            }
        })
    }

    @ReactMethod
    fun deleteToken(promise: Promise) {
        RuStorePushClient.deleteToken().addOnCompleteListener(object : OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(createError(throwable.message.toString(), throwable.getStackTrace().toString()))
            }

            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    @ReactMethod
    fun subscribeToTopic(topic: String, promise: Promise) {
        RuStorePushClient.subscribeToTopic(topic).addOnCompleteListener(object : OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(createError(throwable.message.toString(), throwable.getStackTrace().toString()))
            }
        
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    @ReactMethod
    fun unsubscribeFromTopic(topic: String, promise: Promise) {
        RuStorePushClient.unsubscribeFromTopic(topic).addOnCompleteListener(object : OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(createError(throwable.message.toString(), throwable.getStackTrace().toString()))
            }
        
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    @ReactMethod
    fun sendTestNotification(notification: ReadableMap, promise: Promise) {
        val title = notification.getString("title")
        val body = notification.getString("body")
        val imgUrl = notification.getString("imgUrl")
        val data = notification.getMap("data")

        val payload = TestNotificationPayload(
            title = if (title != null) title else "",
            body = if (body != null) body else "",
            imgUrl = if (imgUrl != null) imgUrl else "",
            data = if (data != null) convertReadableMap(data) else mapOf(),
        )

        RuStorePushClient.sendTestNotification(payload).addOnCompleteListener(object : OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(createError(throwable.message.toString(), throwable.getStackTrace().toString()))
            }
        
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    @ReactMethod
    @Suppress("UNUSED_PARAMETER")
    fun addListener(eventName: String) {
        // В новой версии React Native каждый модуль должен реализовывать этот метод
    }

    @ReactMethod
    @Suppress("UNUSED_PARAMETER")
    fun removeListeners(count: Int) {
        // В новой версии React Native каждый модуль должен реализовывать этот метод
    }

    override fun getConstants(): MutableMap<String, String> = hashMapOf(
        "PUSH_LOGGER_TAG" to Constants.PUSH_LOGGER_TAG,
        "MESSAGING_SERVICE_TAG" to Constants.MESSAGING_SERVICE_TAG,
    )

    override fun getName() = Constants.MODULE_NAME
}
