from flask import Blueprint, jsonify, request
from app.models import db, Message, Channel
from flask_login import current_user, login_required


message_routes = Blueprint('messages', __name__)


@message_routes.route('/')
@login_required
def get_messages(channel_id):
    raw_messages = Message.query.filter(Message.channel_id == channel_id).all()
    messages = [message.to_dict() for message in raw_messages]
    return {'messages': messages}