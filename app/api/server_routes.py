from flask import Bluepring, jsonify, request
from app.models import db, Server
from flask_login import current_user

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
    server_name = request.json.name
    description = request.json.description
    server = Server(
        name=server_name,
        ownerId=int(current_user.id)
        description=description
    )
    db.session.add(server)
    db.session.commit()
    return {'server': server.to_dict()}


@server_routes.route('/<int:server_id>', methods=['DELETE'])
@login_required
def delete_server(server_id):
    const user_id = int(current_user.id)
    server = Server.query.get(server_id)
    if server.owner_id != user_id:
        return {'errors': 'User is not server owner'}, 401
    server.session.delete(server)
    server.commit()
    return {'message': 'Server successfully deleted'}
