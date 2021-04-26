from flask import Blueprint, jsonify, request
from app.models import db, Channel
from flask_login import current_user


channel_routes = Blueprint('channels', __name__)


@channel_routes.route('/')
@login_required
def get_channels(server_id):
    raw_channels = Channel.query.filter(Server.id == server_id).all()
    channels = [channel.to_dict() for channel in raw_channels]
    return {'channels': channels}


@channel_routes.route('/', methods=['POST'])
@login_required
def create_channel(server_id):
    channel_name = request.json.name
    channel = Channel(
        name=channel_name,
        server_id=server_id
    )
    db.session.add(channel)
    db.session.commit()
    return {'channel': channel.to_dict()}


@channel_routes.route('/<int:channel_id>', methods=['DELETE'])
@login_required
def delete_channel(server_id, channel_id):
    channel = Channel.query.get(channel_id)
    if channel.server_id != server_id:
        return {'errors': 'Channel is not part of server'}, 401
    db.session.delete(channel)
    db.commit()
    return {'message': 'Channel successfully deleted'}
