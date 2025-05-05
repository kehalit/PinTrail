
from flask import Flask, jsonify,render_template,request, redirect, url_for, flash, session
from datamanager.sqllite_data_manager import SQLiteDataManager
from werkzeug.exceptions import HTTPException


app = Flask(__name__)
db_manager = SQLiteDataManager(app)

@app.route("/")
def home():
    """Displays the Home page with the list of trips"""
    return "Welcome to PinTrail API!"


@app.route("/add_trips", methods=["POST"])
def add_new_trip():
    """Handle adding a new trip to the database."""
    try:
        data = request.get_json()
        new_trip = db_manager.add_trip(data)

        return jsonify({
            "id": new_trip.id,
            "title": new_trip.title,
            "user_id": new_trip.user_id,
            "country": new_trip.country,
            "city": new_trip.city,
            "start_date": new_trip.start_date.isoformat(),
            "end_date": new_trip.end_date.isoformat(),
            "description": new_trip.description,
            "notes": new_trip.notes,
            "is_public": new_trip.is_public,
            "activities": [
                {
                    "id": a.id,
                    "name": a.name,
                    "location": a.location,
                    "type": a.type,
                    "notes": a.notes,
                    "cost": a.cost,
                    "rating": a.rating,
                    "trip_id": a.trip_id
                } for a in new_trip.activities
            ]
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/trips", methods=["GET"])
def get_trips():
    """GET all trips"""
    try:
        trips = db_manager.get_trips()
        return jsonify([
            {
            "id": trip.id,
            "title": trip.title,
            "user_id": trip.user_id,
            "country": trip.country,
            "city": trip.city,
            "start_date": trip.start_date.isoformat(),
            "end_date": trip.end_date.isoformat(),
            "description": trip.description,
            "notes": trip.notes,
            "is_public": trip.is_public,
            "activities": [
                {
                    "id": a.id,
                    "name": a.name,
                    "location": a.location,
                    "type": a.type,
                    "notes": a.notes,
                    "cost": a.cost,
                    "rating": a.rating,
                    "trip_id": a.trip_id
                } for a in trip.activities
            ]
        } for trip in trips
    ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/trips/<int:trip_id>", methods=["GET"])
def get_trip(trip_id):
    """ Handle adding a single trip by ID """
    trip = next((trip for trip in trips if trip["id"] == trip_id), None)
    if trip:
        return jsonify(trip)
    return jsonify({"error": "Trip not found"}), 404


@app.route("/trips/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id):
    """Handles the trip update for a specific trip_id"""
    data = request.json
    for trip in trips:
        if trip["id"] == trip_id:
            trip["title"] = data.get("title", trip["title"])
            trip["activities"] = data.get("activities", trip["activities"])
            trip["is_public"] = data.get("is_public", trip["is_public"])
            return jsonify(trip)
    return jsonify({"error": "Trip not found"}), 404


@app.route("/trips/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    """Handles the deletion of a trip for a specific id."""
    global trips
    trips = [trip for trip in trips if trip["id"] != trip_id]
    return jsonify({"message": "Trip deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True)


