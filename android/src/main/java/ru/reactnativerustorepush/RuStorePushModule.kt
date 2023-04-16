package ru.reactnativerustorepush

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class RuStorePushModule(reactContext: ReactApplicationContext) :
	ReactContextBaseJavaModule(reactContext) {

	override fun getName(): String {
		return NAME
	}

	@ReactMethod
	fun init(project_id: String, promise: Promise) {
		promise.resolve(null);
	}

	companion object {
		const val NAME = "RuStorePush"
	}
}
