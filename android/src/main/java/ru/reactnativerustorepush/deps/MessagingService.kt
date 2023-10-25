package ru.reactnativerustorepush.deps

import android.content.Intent
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import ru.rustore.sdk.pushclient.messaging.model.RemoteMessage
import ru.rustore.sdk.pushclient.messaging.service.RuStoreMessagingService
import ru.rustore.sdk.pushclient.messaging.exception.RuStorePushClientException

import ru.reactnativerustorepush.deps.Constants

@Serializable
data class NewTokenEventData(val token: String)

@Serializable
data class ErrorEventDataItem(val error: String)

class MessagingService : RuStoreMessagingService() {

    fun log(msg: String) {
        val intent = Intent(Constants.MESSAGING_SERVICE_TAG)

        intent.putExtra(Constants.EXTRA_FIELD_NAME, msg)

        sendBroadcast(intent)
    }

    override fun onNewToken(token: String) {
        val eventData = Json.encodeToString(NewTokenEventData(token))

        log(eventData)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        log(message.toString())
    }

    override fun onDeletedMessages() {
		log("\"null\"")
    }

    override fun onError(errors: List<RuStorePushClientException>) {
        val list: MutableList<ErrorEventDataItem> = mutableListOf()

        errors.forEach { error -> list.add(ErrorEventDataItem(error.toString())) }

        log(Json.encodeToString(list))
    }
}
