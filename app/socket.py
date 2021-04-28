from flask_socketio import SocketIO, join_room, leave_room, send, emit
import os
from app.models import db, Message
import json
from json import JSONEncoder
import datetime

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://most-basic-chat-app.herokuapp.com",
        "https://most-basic-chat-app.herokuapp.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)


class DateTimeEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()


@socketio.on('new_message')
def handle_chat(data):
    message = Message(
        body=data['msg'],
        channel_id=data['channelId'],
        user_id=data['userId']
    )
    db.session.add(message)
    db.session.commit()
    message_dict = message.to_dict()
    message_json = json.dumps(message_dict, cls=DateTimeEncoder)
    emit("chat", message_json, to=data['serverId'])  # broadcast=True,
    # emit("chat", message_json)


@socketio.on('join')
def on_join(data):
    # username = data['username']
    servers = data['serverIds']
    for server in servers:
        print('Joining server room : ', server)
        join_room(server)
    # send(username + ' has entered the room.', to=channel)


@socketio.on('leave')
def on_leave(data):
    # username = data['username']
    servers = data['serverIds']
    for server in servers:
        print('Leaving server room : ', server)
        leave_room(server)
    # send(username + ' has left the room.', to=room)
