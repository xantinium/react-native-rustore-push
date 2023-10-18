package ru.reactnativerustorepush.deps

import ru.rustore.sdk.pushclient.common.logger.Logger

@Suppress("UNUSED_PARAMETER")
fun defaultLog(tag: String, msg: String) {}

class PushLogger(private val tag: String, val log: (String, String) -> Unit = ::defaultLog) : Logger {
    override fun debug(message: String, throwable: Throwable?) {
        log(tag, "${tag} (debug): ${message}")
    }
    override fun error(message: String, throwable: Throwable?) {
        log(tag, "${tag} (error): ${message}")
    }
    override fun info(message: String, throwable: Throwable?) {
        log(tag, "${tag} (info): ${message}")
    }
    override fun verbose(message: String, throwable: Throwable?) {
        log(tag, "${tag} (verbose): ${message}")
    }
    override fun warn(message: String, throwable: Throwable?) {
        log(tag, "${tag} (warn): ${message}")
    }
    override fun createLogger(tag: String): Logger {
        val newTag = if (this.tag != null) {
            "${this.tag}:$tag"
        } else {
            tag
        }
        return PushLogger(newTag)
    }
}