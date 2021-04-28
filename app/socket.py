from flask_socketio import SocketIO, join_room, leave_room, send, emit
import os

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://most-basic-chat-app.herokuapp.com",
        "https://most-basic-chat-app.herokuapp.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on('new_message')
def handle_chat(data):
    print('New chat message: ', data['msg'])
    emit("chat", data, to=data['serverId'])  # broadcast=True,


@socketio.on('join')
def on_join(data):
    # username = data['username']
    servers = data['serverIds']
    for server in servers:
        print('Joining server room : ', server)
        join_room(server)
    # send(username + ' has entered the room.', to=channel)


@socketio.on('leave')
def on_leave(data):
    # username = data['username']
    servers = data['serverIds']
    for server in servers:
        print('Leaving server room : ', server)
        leave_room(server)
    # send(username + ' has left the room.', to=room)
