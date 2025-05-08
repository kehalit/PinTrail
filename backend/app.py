from flask import Flask, jsonify, render_template, request, redirect, url_for, flash, session
from datamanager.sqllite_data_manager import SQLiteDataManager
from werkzeug.exceptions import HTTPException


app = Flask(__name__)
db_manager = SQLiteDataManager(app)

@app.route("/")
def home():
    """
    Displays the home message for the API.

    Returns:
        str: A welcome message to indicate the API is running.
    """
    return "Welcome to PinTrail API!"


@app.route("/add_trip", methods=["POST"])
def add_new_trip():
    """
    Adds a new trip to the database.

    Expects:
        JSON with fields: title, user_id, country, city, start_date, end_date,
        description, notes, is_public, and a list of activities (optional).

    Returns:
        JSON with the newly created trip details and activities on success (201),
        or an error message on failure (400).
    """
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
    """
    Retrieves all trips from the database.

    Returns:
        JSON list of all trips with associated activities (200),
        or an error message on failure (500).
    """
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
    """
    Retrieves a single trip by its ID.

    Args:
        trip_id (int): ID of the trip to retrieve.

    Returns:
        JSON representation of the trip (200),
        or error message if not found (404) or server error (500).
    """
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
    """
    Updates an existing trip by its ID.

    Args:
        trip_id (int): ID of the trip to update.

    Expects:
        JSON with any trip fields to update.

    Returns:
        JSON of the updated trip (200),
        or error if not found (404) or failure (500).
    """
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
    """
    Deletes a trip by its ID.

    Args:
        trip_id (int): ID of the trip to delete.

    Returns:
        Success message (200) if deleted,
        or error message if not found (404).
    """
    success = db_manager.delete_trip(trip_id)
    if success:
        return jsonify({"message": f"Trip {trip_id} deleted successfully."}), 200
    else:
        return jsonify({"error": f"Trip {trip_id} not found."}), 404


@app.route('/users', methods=['POST'])
def add_user():
    """
    Registers a new user.

    Expects:
        JSON with 'username', 'email', and 'password'.

    Returns:
        JSON with user ID, username, and email (201) on success,
        or error for missing fields (400) or server failure (500).
    """
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
    """
    Retrieves all registered users.

    Returns:
        JSON list of users with ID, username, and email (200).
    """
    users = db_manager.get_all_users()
    return jsonify([
        { "id": user.id, "username": user.username, "email": user.email}
        for user in users
    ])


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Retrieves a user by their ID.

    Args:
        user_id (int): ID of the user.

    Returns:
        JSON with user details (200),
        or error if not found (404).
    """
    user = db_manager.get_user_by_id(user_id)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
    return jsonify({"error": "User not found"}), 404


@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Updates user details by ID.

    Args:
        user_id (int): ID of the user to update.

    Expects:
        JSON with any of 'username' or 'email'.

    Returns:
        Updated user info (200),
        or error if not found (404).
    """
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
    """
    Deletes a user by ID.

    Args:
        user_id (int): ID of the user to delete.

    Returns:
        Success message (200),
        or error if user not found (404).
    """
    if db_manager.delete_user(user_id):
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404


@app.route("/activities", methods=["GET"])
def get_activities():
    """
    Retrieves all activities from the database.

    Returns:
        JSON list of activities (200),
        or error message on failure (500).
    """
    try:
        activities = db_manager.get_activities()
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/activities/<int:activity_id>', methods=['GET'])
def get_activity(activity_id):
    """
    Retrieves an activity by its ID.

    Args:
        activity_id (int): ID of the activity to retrieve.

    Returns:
        JSON of the activity (200),
        or error if not found (404).
    """
    activity = db_manager.get_activity_by_id(activity_id)
    if activity:
        return jsonify(activity.to_dict()), 200
    return jsonify({"error": "Activity not found"}), 404


@app.route('/activities', methods=['POST'])
def create_activity():
    """
    Creates a new activity.

    Expects:
        JSON with fields like 'name', 'location', 'type', 'notes',
        'cost', 'rating', and 'trip_id'.

    Returns:
        JSON of the created activity (201),
        or error on validation or server failure (400).
    """
    try:
        activity_data = request.json
        new_activity = db_manager.add_activity(activity_data)
        return jsonify(new_activity.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/activities/<int:activity_id>', methods=['PUT'])
def update_activity(activity_id):
    """
    Updates an activity by ID.

    Args:
        activity_id (int): ID of the activity to update.

    Expects:
        JSON with any fields to update.

    Returns:
        Updated activity (200),
        or error if not found (404) or bad request (400).
    """
    try:
        updates = request.json
        updated_activity = db_manager.update_activity(activity_id, updates)
        if updated_activity:
            return jsonify(updated_activity.to_dict()), 200
        return jsonify({"error": "Activity not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/activities/<int:activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    """
    Deletes an activity by ID.

    Args:
        activity_id (int): ID of the activity.

    Returns:
        Success message (200),
        or error if not found (404) or server error (500).
    """
    try:
        success = db_manager.delete_activity(activity_id)
        if success:
            return jsonify({"message": "Activity deleted successfully"}), 200
        return jsonify({"error": "Activity not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
