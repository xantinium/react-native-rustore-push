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

import ru.rustore.sdk.pushclient.RuStorePushClient

class RuStorePushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

	var ctx: ReactApplicationContext? = null

    fun log(msg: String) {
        var context = ctx
        if (context == null) return
        var ee = context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        ee.emit(PUSH_LOGGER_TAG, msg)
    }

    val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val data = intent.getStringExtra("data")
            if (data != null) {
                log(data)
            }
        }
    }

	@ReactMethod
	fun init(project_id: String, promise: Promise) {
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
        context.registerReceiver(receiver, IntentFilter("MessagingService"))
        RuStorePushClient.init(
            application = app,
            projectId = project_id,
            // logger = PushLogger(PUSH_LOGGER_TAG, ::log)
        )
        promise.resolve(null)
	}

    override fun getName() = NAME

	companion object {
		const val NAME = "RuStorePush"
        const val PUSH_LOGGER_TAG = "PushLogger"
	}
}
