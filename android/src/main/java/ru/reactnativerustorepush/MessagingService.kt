package ru.reactnativerustorepush

import android.content.Intent
import ru.rustore.sdk.pushclient.messaging.model.RemoteMessage
import ru.rustore.sdk.pushclient.messaging.service.RuStoreMessagingService
import ru.rustore.sdk.pushclient.messaging.exception.RuStorePushClientException

class MessagingService : RuStoreMessagingService() {

    fun log(msg: String) {
        val intent = Intent("MessagingService")
        intent.putExtra("data", msg)
        sendBroadcast(intent)
    }

    override fun onNewToken(token: String) {
        log(token)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        log("--- Message recieved ---")
        log(message.notification.toString())
    }

    override fun onError(errors: List<RuStorePushClientException>) {
        errors.forEach { error -> log(error.toString()) }
    }
}