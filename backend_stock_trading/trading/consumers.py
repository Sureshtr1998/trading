import json
from channels.generic.websocket import AsyncWebsocketConsumer

# Not using web sockets
class AlertConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # This method is called when the WebSocket is handshaking as part of the connection process.
        self.room_group_name = "alerts"

        # Join the WebSocket group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Called when the WebSocket closes for any reason.
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive WebSocket message from the WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'alert_message',
                'message': message
            }
        )

    # Receive message from the WebSocket group
    async def alert_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
