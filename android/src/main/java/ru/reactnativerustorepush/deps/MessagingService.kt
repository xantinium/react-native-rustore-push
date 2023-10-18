package ru.reactnativerustorepush.deps

import android.content.Intent
import ru.rustore.sdk.pushclient.messaging.model.RemoteMessage
import ru.rustore.sdk.pushclient.messaging.service.RuStoreMessagingService
import ru.rustore.sdk.pushclient.messaging.exception.RuStorePushClientException

import ru.reactnativerustorepush.deps.Constants

class MessagingService : RuStoreMessagingService() {

    fun log(msg: String) {
        val intent = Intent(Constants.MESSAGING_SERVICE_TAG)
        intent.putExtra(Constants.EXTRA_FIELD_NAME, msg)
        sendBroadcast(intent)
    }

    override fun onNewToken(token: String) {
        log(token)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        log(message.notification.toString())
    }

    override fun onError(errors: List<RuStorePushClientException>) {
        errors.forEach { error -> log(error.toString()) }
    }
}