package ru.reactnativerustorepush.deps

import kotlinx.serialization.Serializable

object Constants {
    const val MODULE_NAME = "RuStorePush"
    const val MESSAGING_SERVICE_TAG = "ru.reactnativerustorepush.tags.messaging_service"
    const val PUSH_LOGGER_TAG = "ru.reactnativerustorepush.tags.logger"
    const val EXTRA_FIELD_NAME = "data"
}

@Serializable
data class RuStorePushModuleEvent(
    val name: String,
    val payload: String,
)
