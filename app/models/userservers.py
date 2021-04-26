from .db import db
from datetime import datetime


class UserServer(db.Model):
    __tablename__ = 'userservers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'),
                          nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow,
                           nullable=False)

    def to_dict():
        return {
            'id': self.id,
            'user_id': self.user_id,
            'server_id': self.server_id,
            'created_at': self.created_at,
        }
