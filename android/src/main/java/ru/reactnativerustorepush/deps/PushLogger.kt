package ru.reactnativerustorepush.deps

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString

import ru.rustore.sdk.pushclient.common.logger.Logger

@Serializable
data class LogEventData(val message: String, val stackTrace: String?)

class PushLogger(private val tag: String): Logger {
    var log: ((String, String) -> Unit)? = null

    fun setLogFunc(logFunc: (String, String) -> Unit) {
        log = logFunc
    }

    fun logEvent(message: String, throwable: Throwable?) {
        val logFunc = log

        if (logFunc == null) {
            return
        }

        val stackTrace = if (throwable == null) null else throwable.stackTraceToString()

        val eventData = Json.encodeToString(LogEventData(message, stackTrace))
        
        logFunc(tag, eventData)
    }

    override fun debug(message: String, throwable: Throwable?) {
        logEvent(message, throwable)
    }

    override fun error(message: String, throwable: Throwable?) {
        logEvent(message, throwable)
    }

    override fun info(message: String, throwable: Throwable?) {
        logEvent(message, throwable)
    }

    override fun verbose(message: String, throwable: Throwable?) {
        logEvent(message, throwable)
    }

    override fun warn(message: String, throwable: Throwable?) {
        logEvent(message, throwable)
    }

    override fun createLogger(tag: String): Logger {
        val newTag = "${this.tag}:$tag"

        return PushLogger(newTag)
    }
}