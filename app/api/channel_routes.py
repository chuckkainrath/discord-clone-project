from flask import Blueprint, jsonify, request
from app.models import db, Channel, Server, UserServer, User
from flask_login import current_user, login_required

channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/')
@login_required
def get_channels(server_id):
    raw_channels = Channel.query.filter(Channel.server_id == server_id).all()
    channels = [channel.to_dict() for channel in raw_channels]
    return {'channels': channels}


@channel_routes.route('/members')
@login_required
def get_members(server_id):
    # 1. grab every userserver associated w/ serverId.
    userservers = UserServer.query.filter(
        UserServer.server_id == server_id).all()  # Dictionary, something to key into
    # 2. Put user_ids in a list
    userIds = [userserver.user_id for userserver in userservers]
    # 3. Find each user associated with user_id and append it to usernames list
    usernames = {}
    for userId in userIds:
        user = User.query.get(userId)
        usernames[user.id] = {'name': user.username, 'id': user.id}
    # 4. Return usernames
    return {'members': usernames}


@ channel_routes.route('/', methods=['POST'])
@ login_required
def create_channel(server_id):
    channel_name = request.json['name']
    channel = Channel(
        name=channel_name,
        server_id=server_id
    )
    db.session.add(channel)
    db.session.commit()
    return {'channel': channel.to_dict()}

    
@ channel_routes.route('/<int:channel_id>', methods=['DELETE'])
@ login_required
def delete_channel(server_id, channel_id):
    channel = Channel.query.get(channel_id)
    if channel.server_id != server_id:
        return {'errors': 'Channel is not part of server'}, 401
    messages = Message.query.filter(Message.channel_id == channel_id).all()
    for message in messages:
        db.session.delete(message)
    db.session.commit()
    db.session.delete(channel)
    db.session.commit()
    return {'message': 'Channel successfully deleted'}
