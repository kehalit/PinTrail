import os
import sqlite3
from .data_manager_interface import DataManagerInterface
from .data_models import db, User, Trip, Activity, Photo, TokenBlackList
from pathlib import Path
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Database configuration
basedir = Path(__file__).resolve().parent.parent
database_path = os.path.join(basedir,'database', 'pintrail.db')


class SQLiteDataManager(DataManagerInterface):
    def __init__(self, app):
        """Initialize the data manager with Flask app and configure the database."""
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(app)

        with app.app_context():
            db.create_all()

    def get_connection(self):
        """Return a SQLite connection to the configured DB path."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # allows dict-like access
        return conn

    def close_connection(self, exception=None):
        # Optionally close connections if you're storing them in `g` or caching
        pass

    def get_trips(self):
        return Trip.query.all()

    def get_trip_by_id(self, trip_id):
        trip = Trip.query.get(trip_id)
        if trip:
            return trip
        return None

    def add_trip(self, data):
        try:
            new_trip = Trip(
                title=data.get("title"),
                user_id=data.get("user_id"),
                country=data.get("country"),
                city=data.get("city"),
                start_date=datetime.strptime(data.get("start_date"), "%Y-%m-%d").date(),
                end_date=datetime.strptime(data.get("end_date"), "%Y-%m-%d").date(),
                description=data.get("description"),
                notes=data.get("notes"),
                is_public=data.get("is_public", False),
                lat=data.get("lat"),
                lng=data.get("lng"),
            )

            db.session.add(new_trip)
            db.session.flush()  # assigns new_trip.id

            activities_data = data.get("activities", [])
            for activity_data in activities_data:
                activity = Activity(
                    name=activity_data.get("name"),
                    location=activity_data.get("location"),
                    type=activity_data.get("type"),
                    notes=activity_data.get("notes"),
                    cost=activity_data.get("cost"),
                    rating=activity_data.get("rating"),
                    trip_id=new_trip.id
                )
                db.session.add(activity)

            db.session.commit()
            return new_trip

        except Exception as e:
            db.session.rollback()
            raise e

    def update_trip(self, trip_id, data):
        trip = Trip.query.get(trip_id)
        if not trip:
            return None

        for field in ['title', 'country', 'city', 'start_date', 'end_date', 'description', 'notes', 'is_public', 'lat', 'lng']:
            if field in data:
                setattr(trip, field, data[field])

        if 'activities' in data:
            trip.activities.clear()
            for activity_data in data['activities']:
                activity = Activity(**activity_data)
                trip.activities.append(activity)

        db.session.commit()
        return trip

    def delete_trip(self, trip_id):
        trip = Trip.query.get(trip_id)
        if not trip:
            return False
        db.session.delete(trip)
        db.session.commit()
        return True

    def get_trips_by_user(self, user_id):
        return Trip.query.filter_by(user_id=user_id).all()

    # Create a new user
    def add_user(self, username, email, password):
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    # Get all users
    def get_all_users(self):
        return User.query.all()

    # Get a user by ID
    def get_user_by_id(self, user_id):
        return User.query.get(user_id)

    # Update a user
    def update_user(self, user_id, updated_data):
        user = User.query.get(user_id)
        if not user:
            return None
        for key, value in updated_data.items():
            setattr(user, key, value)
        db.session.commit()
        return user

    # Delete a user
    def delete_user(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True

    def get_user_by_email(self, email):
        return User.query.filter_by(email=email).first()

    def verify_password(self, user, input_password):
        return check_password_hash(user.password_hash, input_password)


    def add_activity(self, data):
        new_activity = Activity(
            name=data["name"],
            type=data.get("type"),
            location=data.get("location"),
            cost=data.get("cost"),
            notes=data.get("notes"),
            rating=data.get("rating"),
            trip_id=data["trip_id"],
            lat=data.get("lat"),
            lng=data.get("lng")
        )
        db.session.add(new_activity)
        db.session.commit()
        return new_activity

    def get_activities(self):
        try:
            activities = Activity.query.all()
            return [activity.to_dict() for activity in activities]
        except Exception as e:
            print(f"Error fetching activities: {e}")
            return []

    def get_activities_by_trip_id(self, trip_id):
        try:
            activities = Activity.query.filter_by(trip_id=trip_id).all()
            return [activity.to_dict() for activity in activities]
        except Exception as e:
            print(f"Error fetching activities for trip {trip_id}: {e}")
            return []

    def get_activity_by_id(self, activity_id):
        return Activity.query.get(activity_id)

    def update_activity(self, activity_id, updates):
        activity = Activity.query.get(activity_id)
        if not activity:
            return None
        for key, value in updates.items():
            setattr(activity, key, value)
        db.session.commit()
        return activity

    def delete_activity(self, activity_id):
        activity = Activity.query.get(activity_id)
        if not activity:
            return False
        db.session.delete(activity)
        db.session.commit()
        return True

    def get_trips_by_user_id(self, user_id):
        return db.session.query(Trip).filter_by(user_id=user_id).all()

    def save_changes(self):
        db.session.commit()

    def get_photos(self):
        try:
            photos = Photo.query.all()
            return [photo.to_dict() for photo in photos]
        except Exception as e:
            print(f"Error fetching photos: {e}")
            return []

    def get_photo_by_id(self, photo_id):
        return Photo.query.get(photo_id)

    def get_photos_by_trip_id(self, trip_id):
        try:
            photos = Photo.query.filter_by(trip_id=trip_id).all()
            return [photo.to_dict() for photo in photos]
        except Exception as e:
            print(f"Error fetching photos for trip {trip_id}: {e}")
            return []

    def add_photo(self, photo_data):
        try:
            new_photo = Photo(
                trip_id=photo_data["trip_id"],
                url=photo_data.get("url"),
                caption=photo_data.get("caption")
            )
            db.session.add(new_photo)
            db.session.commit()
            return new_photo
        except Exception as e:
            db.session.rollback()
            raise e

    def update_photo(self, photo_id, updates):
        photo = Photo.query.get(photo_id)
        if not photo:
            return None
        for key, value in updates.items():
            setattr(photo, key, value)
        db.session.commit()
        return photo

    def delete_photo(self, photo_id):
        photo = Photo.query.get(photo_id)
        if not photo:
            return False
        db.session.delete(photo)
        db.session.commit()
        return True

    def insert_photo(self, trip_id, caption, url):
        trip_id, caption, url
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO photos (trip_id, caption, url)
            VALUES (?, ?, ?)
        """, (trip_id, caption, url))

        conn.commit()
        photo_id = cursor.lastrowid
        conn.close()

        return photo_id

    def is_token_blacklisted(self, jti):
        return TokenBlackList.query.filter_by(jti=jti).first() is not None

    def blacklist_token(self, jti):
        token = TokenBlackList(jti=jti)
        db.session.add(token)
        db.session.commit()