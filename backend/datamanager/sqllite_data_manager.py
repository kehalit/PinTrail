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


    def get_all_users(self):
        return User.query.all()

    def get_user_by_id(self, user_id):
        return User.query.get(user_id)

    def get_trips(self):
        return Trip.query.all()

    def create_trip(self, trip_data):
        activities_data = trip_data.pop("activities", [])

        # Convert string dates to Python date objects
        if "start_date" in trip_data:
            trip_data["start_date"] = datetime.strptime(trip_data["start_date"], "%Y-%m-%d").date()
        if "end_date" in trip_data:
            trip_data["end_date"] = datetime.strptime(trip_data["end_date"], "%Y-%m-%d").date()

        trip = Trip(**trip_data)
        db.session.add(trip)
        db.session.commit()

        # Add related activities
        for activity_title in activities_data:
            activity = Activity(name=activity_title, trip_id=trip.id)
            db.session.add(activity)

        db.session.commit()
        return trip

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
