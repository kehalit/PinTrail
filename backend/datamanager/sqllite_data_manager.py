import os
from .data_manager_interface import DataManagerInterface
from .data_models  import db, User, Trip, Activity, Photo
from pathlib import Path
from datetime import datetime

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
                is_public=data.get("is_public", False)
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

    def get_all_users(self):
        return User.query.all()

    def get_user_by_id(self, user_id):
        return User.query.get(user_id)

    def update_trip(self, trip_id, data):
        trip = Trip.query.get(trip_id)
        if not trip:
            return None

        for field in ['title', 'country', 'city', 'start_date', 'end_date', 'description', 'notes', 'is_public']:
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

    def add_activity_to_trip(self, trip_id, activity_data):
        activity = Activity(**activity_data, trip_id=trip_id)
        db.session.add(activity)
        db.session.commit()
        return activity

    def add_photo_to_activity(self, activity_id, photo_data):
        photo = Photo(**photo_data, activity_id=activity_id)
        db.session.add(photo)
        db.session.commit()
        return photo
