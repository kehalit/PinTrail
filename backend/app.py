
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
    try:
        trip = db_manager.get_trip_by_id(trip_id)
        if trip:
            return jsonify(trip.to_dict()), 200
        else:
            return jsonify({"error": "Trip not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/trips/<int:trip_id>', methods=['PUT'])
def update_trip(trip_id):
    """update a trip by using tirp id"""
    try:
        data = request.get_json()
        updated_trip = db_manager.update_trip(trip_id, data)
        if updated_trip:
            return jsonify(updated_trip.to_dict()), 200
        else:
            return jsonify({"error": "Trip not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/trips/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    """delete a trip by using trip id """
    success = db_manager.delete_trip(trip_id)
    if success:
        return jsonify({"message": f"Trip {trip_id} deleted successfully."}), 200
    else:
        return jsonify({"error": f"Trip {trip_id} not found."}), 404


@app.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400

        new_user = db_manager.add_user(username, email, password)

        return jsonify({
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    users = db_manager.get_all_users()
    return jsonify([
        { "id": user.id, "username": user.username, "email": user.email}
        for user in users
    ])


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db_manager.get_user(user_id)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
    return jsonify({"error": "User not found"}), 404


@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = db_manager.update_user(user_id, data)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
    return jsonify({"error": "User not found"}), 404


@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if db_manager.delete_user(user_id):
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)


