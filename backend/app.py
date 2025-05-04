
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.ext.declarative import DeferredReflection

app = Flask(__name__)
CORS(app)

trips = [
    {
        "id": 1,
        "title": "Italy Trip",
        "country": "Italy",
        "activities": ["Visited Colosseum", "Ate pasta in Rome"],
        "is_public": True
    },

    {
        "id": 2,
        "title": "Japan Trip",
        "country": "Japan",
        "activities": ["Visited Tokyo", "Mount picano"],
        "is_public": True
    }
]


@app.route("/")
def home():
    """Displays the Home page with the list of trips"""
    return "Welcome to PinTrail API!"


@app.route("/trips", methods=["GET"])
def get_trips():
    """GET all trips"""
    return jsonify(trips)


@app.route("/add_trips", methods=["POST"])
def add_new_trips():
    """Handle adding a new trip """
    data = request.json
    new_id = len(trips) + 1
    new_trip = { "id" : new_id,
                 "title":data.get("title"),
                 "country":data.get("country"),
                 "activities": data.get("activities", []),
                 "is_public":data.get("is_public", True)

    }
    trips.append(new_trip)
    return jsonify(new_trip), 201


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
