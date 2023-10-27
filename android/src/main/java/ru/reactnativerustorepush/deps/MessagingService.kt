package ru.reactnativerustorepush.deps

import android.content.Intent
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString

import ru.rustore.sdk.pushclient.messaging.model.Notification
import ru.rustore.sdk.pushclient.messaging.model.RemoteMessage
import ru.rustore.sdk.pushclient.messaging.service.RuStoreMessagingService
import ru.rustore.sdk.pushclient.messaging.exception.RuStorePushClientException
import ru.reactnativerustorepush.deps.Constants
import ru.reactnativerustorepush.deps.RuStorePushModuleEvent

@Serializable
data class NewTokenEventPayload(
    val token: String,
)

@Serializable
data class NotificationObject(
    val title: String?,
    val body: String?,
    val channelId: String?,
    val imageUrl: String?,
    val color: String?,
    val icon: String?, 
    val clickAction: String?,
)

@Serializable
data class MessageObject(
    val messageId: String?,
    val priority: Int,
    val ttl: Int,
    val collapseKey: String?,
    val data: Map<String, String>,
    val rawData: ByteArray?,
    val notification: NotificationObject?,
)

class MessagingService : RuStoreMessagingService() {

    fun log(eventName: String, eventPayload: String) {
        val intent = Intent(Constants.MESSAGING_SERVICE_TAG)
        val msg = Json.encodeToString(RuStorePushModuleEvent(eventName, eventPayload))

        intent.putExtra(Constants.EXTRA_FIELD_NAME, msg)

        sendBroadcast(intent)
    }

    override fun onNewToken(token: String) {
        val eventPayload = Json.encodeToString(NewTokenEventPayload(token))

        log("new-token", eventPayload)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        var notification: NotificationObject? = null

        if (message.notification != null) {
            val messageNotification = message.notification as Notification

            notification = NotificationObject(
                title = messageNotification.title,
                body = messageNotification.body,
                channelId = messageNotification.channelId,
                imageUrl = messageNotification.imageUrl?.toString(),
                color = messageNotification.color,
                icon = messageNotification.icon,
                clickAction = messageNotification.clickAction,
            )
        }

        val eventPayload = Json.encodeToString(
            MessageObject(
                messageId = message.messageId,
                priority = message.priority,
                ttl = message.ttl,
                collapseKey = message.collapseKey,
                data = message.data,
                rawData = message.rawData,
                notification = notification,
            )
        )

        log("message-received", eventPayload)
    }

    override fun onDeletedMessages() {
		log("deleted-messages", "\"null\"")
    }

    override fun onError(errors: List<RuStorePushClientException>) {
        val list: MutableList<String> = mutableListOf()

        errors.forEach { error -> list.add(error.toString()) }

        log("error", Json.encodeToString(list))
    }
}
