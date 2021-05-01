from flask_socketio import SocketIO, join_room, leave_room, send, emit
import os
from app.models import db, Message, Channel, UserServer, Server, Invite
import json
from json import JSONEncoder
import datetime
from flask_login import current_user

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://racketapp.herokuapp.com",
        "https://racketapp.herokuapp.com"
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


# data must have userId, serverId
@socketio.on('delete_server')
def handle_delete_server(data):
    user_id = data['userId']
    server_id = data['serverId']
    server = Server.query.get(server_id)
    if server.owner_id == user_id:
        # Get all channels/messages
        channels = Channel.query.filter(Channel.server_id == server_id).all()
        channelIds = [channel.id for channel in channels]
        messages = Message.query.filter(Message.channel_id.in_(channelIds)).all()
        for message in messages:
            db.session.delete(message)
        db.session.commit()
        for channel in channels:
            db.session.delete(channel)
        db.session.commit()
        # Get all invites in channel
        invites = Invite.query.filter(Invite.server_id == server_id).all()
        for invite in invites:
            db.session.delete(invite)
        db.session.commit()
        # Get all userServers
        userServers = UserServer.query.filter(UserServer.server_id == server_id).all()
        for userServer in userServers:
            db.session.delete(userServer)
        db.session.commit()
        db.session.delete(server)
        db.session.commit()

        returnData = {
            'server_id': server_id
        }
        emit("delete_server", returnData, to=str(server_id))


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


@socketio.on('leave_server')
def handle_leave_server(data):
    userId = data['userId']
    userServers = UserServer.query.filter(UserServer.user_id == userId).all()
    for userServer in userServers:
        if userServer.server_id == data['serverId']:
            db.session.delete(userServer)
            db.session.commit()
            break

    returnData = {
        'server_id': data['serverId'],
        'user_id': userId,
    }
    emit("leave_server", returnData, to=str(data['serverId']))
    leave_room(str(data['serverId']))


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
