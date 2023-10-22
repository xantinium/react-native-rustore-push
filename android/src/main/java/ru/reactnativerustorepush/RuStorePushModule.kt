package ru.reactnativerustorepush

import android.content.Intent
import android.content.Context
import android.app.Application
import android.content.IntentFilter
import android.content.BroadcastReceiver
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule

import ru.reactnativerustorepush.deps.PushLogger
import ru.reactnativerustorepush.deps.Constants
import ru.rustore.sdk.pushclient.common.logger.Logger
import ru.rustore.sdk.pushclient.RuStorePushClient
import ru.rustore.sdk.core.tasks.OnCompleteListener
import ru.rustore.sdk.core.feature.model.FeatureAvailabilityResult

class RuStorePushModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {

	var ctx: ReactApplicationContext? = null

    fun log(tag: String, msg: String) {
        var context = ctx

        if (context == null) {
            return
        }

        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(tag, msg)
    }

    val receiver = object: BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val data = intent.getStringExtra(Constants.EXTRA_FIELD_NAME)

            if (data != null) {
                log(Constants.MESSAGING_SERVICE_TAG, data)
            }
        }
    }

	@ReactMethod
	fun init(project_id: String, useLogger: Boolean, testMode: Boolean, promise: Promise) {
		if (ctx != null) {
            promise.resolve("ALREADY_INITIALIZED")
            return
        }

        var context = this.getReactApplicationContext()
        ctx = context

        var app: Application? = null
        var activity = this.getCurrentActivity()

        if (activity != null) {
            app = activity.getApplication()
        }

        if (app == null) {
            promise.resolve("APP_NOT_FOUND")
            return
        }

        context.registerReceiver(receiver, IntentFilter(Constants.MESSAGING_SERVICE_TAG))

        if (useLogger) {
            val logger = PushLogger(Constants.PUSH_LOGGER_TAG)

            logger.setLogFunc(::log)

            RuStorePushClient.init(
                application = app,
                projectId = project_id,
                testModeEnabled = testMode,
                logger = logger,
            )
        }

        RuStorePushClient.init(
            application = app,
            projectId = project_id,
            testModeEnabled = testMode,
        )

        promise.resolve(null)
	}

    @ReactMethod
    fun checkPushAvailability(promise: Promise) {
        RuStorePushClient.checkPushAvailability().addOnCompleteListener(object: OnCompleteListener<FeatureAvailabilityResult>{
            override fun onSuccess(result: FeatureAvailabilityResult) {
                when (result) {
                    FeatureAvailabilityResult.Available -> {
                        promise.resolve("OK")
                    }

                    is FeatureAvailabilityResult.Unavailable -> {
                        promise.resolve(result.cause.toString())
                    }
                }
            }

            override fun onFailure(throwable: Throwable) {
                promise.resolve(throwable.stackTraceToString())
            }
        })
    }

    @ReactMethod
    fun getToken(promise: Promise) {
        RuStorePushClient.getToken().addOnCompleteListener(object: OnCompleteListener<String>{
            override fun onFailure(throwable: Throwable) {
                promise.resolve(throwable.stackTraceToString())
            }

            override fun onSuccess(result: String) {
                promise.resolve(result)
            }
        })
    }

    @ReactMethod
    fun deleteToken(promise: Promise) {
        RuStorePushClient.deleteToken().addOnCompleteListener(object: OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(throwable.stackTraceToString())
            }

            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    @ReactMethod
    fun subscribeToToic(topic: String, promise: Promise) {
        RuStorePushClient.subscribeToTopic(topic).addOnCompleteListener(object: OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(throwable.stackTraceToString())
            }
        
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    @ReactMethod
    fun unsubscribeFromTopic(topic: String, promise: Promise) {
        RuStorePushClient.unsubscribeFromTopic(topic).addOnCompleteListener(object: OnCompleteListener<Unit> {
            override fun onFailure(throwable: Throwable) {
                promise.resolve(throwable.stackTraceToString())
            }
        
            override fun onSuccess(result: Unit) {
                promise.resolve(null)
            }
        })
    }

    override fun getConstants(): MutableMap<String, String> = hashMapOf(
        "PUSH_LOGGER_TAG" to Constants.PUSH_LOGGER_TAG,
        "MESSAGING_SERVICE_TAG" to Constants.MESSAGING_SERVICE_TAG,
    )

    override fun getName() = Constants.MODULE_NAME
}
