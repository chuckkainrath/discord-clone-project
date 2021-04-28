from flask_socketio import SocketIO, join_room, leave_room
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


@socketio.on("message")
def handle_chat(data):
    emit("chat", data, broadcast=True, to=data['channelId'])  # broadcast=True,


@socketio.on('join')
def on_join(data):
    # username = data['username']
    channel = data['channelId']
    join_room(channel)
    # send(username + ' has entered the room.', to=channel)


@socketio.on('leave')
def on_leave(data):
    # username = data['username']
    channel = data['room']
    leave_room(channel)
    # send(username + ' has left the room.', to=room)


# io.sockets.on('connection', function(socket) {
#     socket.on('join', function(room) {
#         socket.join(room)
#     })
# })
