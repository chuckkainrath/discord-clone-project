from flask import Blueprint, jsonify, request
from app.models import db, Server, User, Channel, Message, UserServer, Invite
from flask_login import current_user, login_required
from app.forms import ServerForm
from app.aws import upload_photo_to_s3, valid_file_type, get_unique_filename

server_routes = Blueprint('servers', __name__)


@server_routes.route('/')
@login_required
def get_servers():
    user_id = int(current_user.id)
    userServers = UserServer.query.filter(UserServer.user_id == user_id).all()
    serverIds = [userServer.server_id for userServer in userServers]
    raw_servers = Server.query.filter(Server.id.in_(serverIds)).all()
    servers = [server.to_dict() for server in raw_servers]
    return {'servers': servers}


@server_routes.route('/', methods=['POST'])
@login_required
def create_server():
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        server_img_url = ''
        server_img = request.files.get('server-icon', '')
        if server_img and valid_file_type(server_img.filename):
            server_img.filename = get_unique_filename(server_img.filename)
            upload_response = upload_photo_to_s3(server_img, 'server')
            server_img_url = upload_response['photo_url'] \
                if upload_response['photo_url'] else ''

        server_name = form.data['name']
        description = form.data['description']
        server = Server(
            name=server_name,
            owner_id=int(current_user.id),
            description=description,
            server_img_url=server_img_url
        )
        db.session.add(server)
        db.session.commit()

        # Create UserServer entry
        userServer = UserServer(
            user_id=int(current_user.id),
            server_id=int(server.id)
        )
        db.session.add(userServer)
        channel = Channel(
            name='General',
            server_id=server.id
        )
        db.session.add(channel)
        db.session.commit()
        server_dict = server.to_dict()
        channel_dict = channel.to_dict()
        return {'server': server_dict, 'channel': channel_dict}
    return {'errors': 'Could not create server'}


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
    return {'message': 'Server successfully deleted'}


@server_routes.route('/userservers')
@login_required
def get_userservers():
    user_id = int(current_user.id)
    userServers = UserServer.query.filter(UserServer.user_id == user_id).all()
    serverIds = [userServer.server_id for userServer in userServers]
    raw_servers = Server.query.filter(Server.id.in_(serverIds)).all()
    servers = [server.to_dict() for server in raw_servers]
    return {'servers': servers}
