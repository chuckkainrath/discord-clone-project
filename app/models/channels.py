from .db import db
from datetime import datetime


class Channel(db.Model):
    __tablename__ = 'channels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'),
                          nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow,
                           nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow, nullable=False)

    def to_dict():
        return {
            'id': self.id,
            'name': self.name,
            'server_id': self.server_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
