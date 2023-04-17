package ru.reactnativerustorepush

import android.app.Application
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

import ru.rustore.sdk.pushclient.RuStorePushClient

class RuStorePushModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

	var ctx: ReactApplicationContext? = null

	override fun getName(): String {
		return NAME
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
        // context.registerReceiver(receiver, IntentFilter("MessagingService"))
        RuStorePushClient.init(
            application = app,
            projectId = project_id,
            // logger = PushLogger(PUSH_LOGGER_TAG, ::log)
        )
        promise.resolve(null)
	}

	companion object {
		const val NAME = "RuStorePush"
	}
}
