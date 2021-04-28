from flask import Blueprint, jsonify, request
from app.models import db, Server, User, Channel, Message
from flask_login import current_user, login_required

server_routes = Blueprint('servers', __name__)


@server_routes.route('/')
@login_required
def get_servers():
    user_id = int(current_user.id)
    raw_servers = Server.query.filter(User.id == user_id).all()
    servers = [server.to_dict() for server in raw_servers]
    return {'servers': servers}


@server_routes.route('/', methods=['POST'])
@login_required
def create_server():
    server_name = request.json['name']
    description = request.json['description']
    server = Server(
        name=server_name,
        owner_id=int(current_user.id),
        description=description
    )
    db.session.add(server)
    db.session.commit()
    channel = Channel(
        name='General',
        server_id=server.id
    )
    db.session.add(channel)
    db.session.commit()
    server_dict = server.to_dict()
    channel_dict = channel.to_dict()
    return {'server': server_dict, 'channel': channel_dict}


@server_routes.route('/<int:server_id>', methods=['DELETE'])
@login_required
def delete_server(server_id):
    user_id = int(current_user.id)
    server = Server.query.get(server_id)
    if server.owner_id != user_id:
        return {'errors': 'User is not server owner'}, 401
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
    db.session.delete(server)
    db.session.commit()
    return {'message': 'Server successfully deleted'}


# Need to delete all channels/messages in server as well
