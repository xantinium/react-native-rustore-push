package ru.reactnativerustorepush.deps

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString

import ru.rustore.sdk.pushclient.common.logger.Logger
import ru.reactnativerustorepush.deps.RuStorePushModuleEvent

@Serializable
data class ModuleError(
    val msg: String,
    val stackTrace: String,
)

@Serializable
data class LogEventPayload(
    val eventName: String,
    val error: ModuleError?,
)

class PushLogger(private val tag: String) : Logger {

    var log: ((String, String) -> Unit)? = null

    fun setLogFunc(logFunc: (String, String) -> Unit) {
        log = logFunc
    }

    fun logEvent(eventName: String, message: String, throwable: Throwable?) {
        val logFunc = log

        if (logFunc != null) {
            var err: ModuleError? = null

            if (throwable != null) {
                err = ModuleError(
                    throwable.message.toString(),
                    throwable.getStackTrace().toString(),
                )
            }

            val eventPayload = Json.encodeToString(LogEventPayload(message, err))
            val msg = Json.encodeToString(RuStorePushModuleEvent(eventName, eventPayload))
            
            logFunc(tag, msg)
        }
    }

    override fun debug(message: String, throwable: Throwable?) {
        logEvent("debug", message, throwable)
    }

    override fun error(message: String, throwable: Throwable?) {
        logEvent("error", message, throwable)
    }

    override fun info(message: String, throwable: Throwable?) {
        logEvent("info", message, throwable)
    }

    override fun verbose(message: String, throwable: Throwable?) {
        logEvent("verbose", message, throwable)
    }

    override fun warn(message: String, throwable: Throwable?) {
        logEvent("warn", message, throwable)
    }

    override fun createLogger(tag: String): Logger {
        val newTag = "${this.tag}:$tag"

        return PushLogger(newTag)
    }
}