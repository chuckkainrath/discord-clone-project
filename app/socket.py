from flask_socketio import SocketIO, join_room, leave_room, send, emit
import os
from app.models import db, Message, Channel
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


@socketio.on('new_channel')
def handle_channel(data):
    channel = Channel(
        name=data['name'],
        server_id=data['serverId']
    )
    db.session.add(channel)
    db.session.commit()
    channel_dict = channel.to_dict()
    channel_json = json.dumps(channel_dict, cls=DateTimeEncoder)
    emit("channel", channel_json, to=str(data['serverId']))


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
    message_dict['username'] = data['user']
    message_json = json.dumps(message_dict, cls=DateTimeEncoder)
    emit("chat", message_json, to=str(data['serverId']))  # broadcast=True,
    # emit("chat", message_json)


@socketio.on('delete_channel')
def handle_delete_channel(data):
    channel = Channel.query.get(data['channelId'])
    messages = Message.query.filter(Message.channel_id == data['channelId']) \
                      .all()
    for message in messages:
        db.session.delete(message)
    db.session.commit()
    db.session.delete(channel)
    db.session.commit()
    returnData = {
        'channel_id': data['channelId']
    }
    emit("delete_channel", returnData, to=str(data['serverId']))


@socketio.on('edit_channel')
def handle_edit_channel(data):
    channel = Channel.query.get(data['channelId'])
    channel.name = data['name']
    db.session.add(channel)
    db.session.commit()
    returnData = {
        'channel_id': data['channelId'],
        'name': data['name']
    }
    emit("edit_channel", returnData, to=str(data['serverId']))


@socketio.on('delete_message')
def handle_delete_message(data):
    message = Message.query.get(data['messageId'])
    db.session.delete(message)
    db.session.commit()
    returnData = {
        'message_id': data['messageId']
    }
    emit("delete_message", returnData, to=str(data['serverId']))


@socketio.on('edit_message')
def handle_edit_message(data):
    message = Message.query.get(data['messageId'])
    message.body = data['body']
    db.session.add(message)
    db.session.commit()
    returnData = {
        'message_id': data['messageId'],
        'body': data['body']
    }
    emit("edit_message", returnData, to=str(data['serverId']))


@socketio.on('join')
def on_join(data):
    # username = data['username']
    servers = data['serverIds']
    for server in servers:
        join_room(server)
    # send(username + ' has entered the room.', to=channel)


@socketio.on('leave')
def on_leave(data):
    # username = data['username']
    servers = data['serverIds']
    for server in servers:
        leave_room(server)
    # send(username + ' has left the room.', to=room)
