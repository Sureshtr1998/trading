from django.urls import path
from . import consumers
# Not using
websocket_urlpatterns = [
    path('ws/alerts/', consumers.AlertConsumer.as_asgi()),
]
