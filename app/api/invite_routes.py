from flask import Blueprint, jsonify, request
from app.models import db, Invite, User, UserServer, Server
from flask_login import current_user, login_required


invite_routes = Blueprint('invites', __name__)


@invite_routes.route('/')
@login_required
def get_invites():
    user_id = int(current_user.id)
    raw_invites = Invite.query.filter(Invite.user_id == user_id).all()
    invites = [invite.to_dict() for invite in raw_invites]
    return {'invites': invites}


@invite_routes.route('/<int:server_id>', methods=["POST"])
def send_invite(server_id):
    username = request.json['username']
    print('SENDING INVITE TO SERVER', server_id, username)
    invited_user = User.query.filter(User.username == username).first()
    if not invited_user:
        return {'response': 'No user with that username exists'}

    invite = Invite.query.filter(Invite.user_id == invited_user.id and
                                 Invite.server_id == server_id).first()
    if invite:
        return {'response': 'User already has invite pending.'}

    invite = Invite(
        user_id=invited_user.id,
        server_id=server_id
    )
    db.session.add(invite)
    db.session.commit()
    return {'response': 'Invite sent!'}


@invite_routes.route('/<int:server_id>', methods=["DELETE"])
def process_invite(server_id):
    user_id = int(current_user.id)
    accept = request.json['accept']
    invite = Invite.query.filter(Invite.user_id == user_id and
                                 Invite.server_id == server_id).first()
    if not invite:
        return {'response': 'Invite not found'}

    if not accept:
        db.session.delete(invite)
        db.commit()
        return {'response': 'Invite declined'}

    # If invite accepted
    userServer = UserServer(
        user_id=user_id,
        server_id=server_id
    )
    db.session.add(userServer)
    db.session.commit()
    server = Server.query.get(server_id)
    server_dict = server.to_dict()
    return {'server': server_dict}
