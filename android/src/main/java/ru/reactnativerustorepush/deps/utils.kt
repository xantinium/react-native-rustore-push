package ru.reactnativerustorepush.deps

import android.content.Intent
import android.content.Context
import android.content.BroadcastReceiver
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableType

class MessagingReceiver(val log: (String, String) -> Unit) : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val data = intent.getStringExtra(Constants.EXTRA_FIELD_NAME)

        if (data != null) {
            log(Constants.MESSAGING_SERVICE_TAG, data)
        }
    }
}

fun convertReadableMap(readableMap: ReadableMap): Map<String, String> {
    val map = HashMap<String, String>()
    val iterator = readableMap.keySetIterator()

    while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val type = readableMap.getType(key)

        when (type) {
            ReadableType.Boolean -> map.put(key, readableMap.getBoolean(key).toString())
            ReadableType.Number -> map.put(key, readableMap.getDouble(key).toString())
            ReadableType.String -> map.put(key, readableMap.getString(key).toString())
            else -> {}
        }
    }

    return map
}

fun createError(msg: String, stackTrace: String? = null): ReadableMap {
    val map = Arguments.createMap();

    map.putString("msg", msg)

    if (stackTrace != null) {
        map.putString("stackTrace", stackTrace)
    }

    return map
}
