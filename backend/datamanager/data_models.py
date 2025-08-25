from datetime import datetime


from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    trips = db.relationship("Trip", backref="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)
    notes = db.Column(db.Text)
    is_public = db.Column(db.Boolean, default=True)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)

    activities = db.relationship("Activity", backref="trip", cascade="all, delete-orphan")
    photos = db.relationship("Photo", backref="trip", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "user_id": self.user_id,
            "country": self.country,
            "city": self.city,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "description": self.description,
            "notes": self.notes,
            "is_public": self.is_public,
            "activities": [activity.to_dict() for activity in self.activities] if self.activities else [],
            "photos": [p.to_dict() for p in self.photos],
            "lat": self.lat,
            "lng": self.lng
        }


class Activity(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=False)
    type = db.Column(db.String(50))  # e.g., 'restaurant', 'museum', 'beach'
    name = db.Column(db.String(100))
    location = db.Column(db.String(200))
    cost = db.Column(db.Float)
    rating = db.Column(db.Integer)
    notes = db.Column(db.Text)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "trip_id": self.trip_id,
            "type": self.type,
            "name": self.name,
            "location": self.location,
            "cost": self.cost,
            "rating": self.rating,
            "notes": self.notes,
            "lat": self.lat,
            "lng": self.lng
        }

class Photo(db.Model):
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=False)
    url = db.Column(db.String(255))
    caption = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "trip_id": self.trip_id,
            "url": self.url,
            "caption": self.caption
        }


class TokenBlackList(db.Model):
    __tablename__ = "token_blacklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)