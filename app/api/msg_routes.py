from flask import Blueprint, jsonify, request
from app.models import db, Message, Channel, User
from flask_login import current_user, login_required


message_routes = Blueprint('messages', __name__)


@message_routes.route('/')
@login_required
def get_messages(server_id, channel_id):
    # raw_messages = Message.query.filter(Message.channel_id == channel_id).all()
    raw_query = db.session.query(Message, User).join(User) \
        .filter(Message.channel_id == channel_id).all()
    messages = []
    for (message, user) in raw_query:
        msg = message.to_dict()
        usr = user.to_dict()
        msg['username'] = usr['username']
        messages.append(msg)
    # messages = [message.to_dict() for message in raw_messages]
    return {'messages': messages}
