from flask import Flask, jsonify, render_template, request, redirect, url_for, flash, session
from flasgger import Swagger
from datamanager.sqllite_data_manager import SQLiteDataManager
from werkzeug.exceptions import HTTPException


app = Flask(__name__)
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "PinTrail API",
        "description": "API documentation for the PinTrail travel app",
        "version": "1.0"
    }
})
db_manager = SQLiteDataManager(app)


def validate_fields(data, required_fields):
    if not data:
        return {"error": "Request must be in JSON format."}
    missing = [field for field in required_fields if field not in data or data[field] is None]
    if missing:
        return {"error": f"Missing required field(s): {', '.join(missing)}"}
    return None


@app.route("/")
def home():
    """
    Displays the home message for the API.
    ---
    responses:
      200:
        description: Welcome message
    """
    return "Welcome to PinTrail API!"


@app.route("/add_trip", methods=["POST"])
def add_new_trip():
    """
    Add a new trip
    ---
    tags:
      - Trips
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: Trip
          required:
            - title
            - user_id
          properties:
            title:
              type: string
              example: Summer in Italy
            user_id:
              type: integer
              example: 1
            country:
              type: string
              example: Italy
            city:
              type: string
              example: Rome
            start_date:
              type: string
              format: date
              example: 2024-07-01
            end_date:
              type: string
              format: date
              example: 2024-07-10
            description:
              type: string
              example: A wonderful vacation.
            notes:
              type: string
              example: Pack light!
            is_public:
              type: boolean
              example: true
    responses:
      201:
        description: Trip successfully created
      400:
        description: Invalid input
    """
    try:
        data = request.get_json()
        required_fields = [
            "title", "user_id", "country", "city",
            "start_date", "end_date", "description",
            "notes", "is_public"
        ]
        error = validate_fields(data, required_fields)
        if error:
            return jsonify(error), 400

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
    Get all trips
    ---
    tags:
      - Trips
    responses:
      200:
        description: A list of trips
      500:
        description: Server error
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
    Get a single trip by ID
    ---
    tags:
      - Trips
    parameters:
      - name: trip_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Trip data
      404:
        description: Trip not found
      500:
        description: Server error
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
    Update a trip
    ---
    tags:
      - Trips
    parameters:
      - name: trip_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          id: TripUpdate
          properties:
            title:
              type: string
            description:
              type: string
    responses:
      200:
        description: Trip updated
      404:
        description: Trip not found
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
    ---
    tags:
      - Trips
    parameters:
      - name: trip_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Trip deleted
      404:
        description: Trip not found
    """
    success = db_manager.delete_trip(trip_id)
    if success:
        return jsonify({"message": f"Trip {trip_id} deleted successfully."}), 200
    else:
        return jsonify({"error": f"Trip {trip_id} not found."}), 404


@app.route('/users', methods=['POST'])
def add_user():
    """
    Create a new user
    ---
    tags:
      - Users
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: User
          required:
            - username
            - email
            - password
          properties:
            username:
              type: string
              example: johndoe
            email:
              type: string
              example: johndoe@example.com
            password:
              type: string
              example: secret123
    responses:
      201:
        description: User successfully created
      400:
        description: Validation error
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
    ---
    tags:
      - Users
    responses:
      200:
        description: A list of users
    """
    users = db_manager.get_all_users()
    return jsonify([
        { "id": user.id, "username": user.username, "email": user.email}
        for user in users
    ])


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get a user by ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: User details
      404:
        description: User not found
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
    Update a user
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        schema:
          id: UserUpdate
          properties:
            username:
              type: string
            email:
              type: string
    responses:
      200:
        description: User updated
      404:
        description: User not found
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
    Delete a user
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: User deleted
      404:
        description: User not found
    """
    if db_manager.delete_user(user_id):
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404


@app.route("/activities", methods=["GET"])
def get_activities():
    """
    Get all activities
    ---
    tags:
      - Activities
    responses:
      200:
        description: A list of activities
      500:
        description: Server error
    """
    try:
        activities = db_manager.get_activities()
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/activities/<int:activity_id>', methods=['GET'])
def get_activity(activity_id):
    """
    Get an activity by ID
    ---
    tags:
      - Activities
    parameters:
      - name: activity_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Activity found
      404:
        description: Activity not found
    """

    activity = db_manager.get_activity_by_id(activity_id)
    if activity:
        return jsonify(activity.to_dict()), 200
    return jsonify({"error": "Activity not found"}), 404


@app.route('/activities', methods=['POST'])
def create_activity():
    """
    Create a new activity
    ---
    tags:
      - Activities
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: Activity
          required:
            - name
            - trip_id
          properties:
            name:
              type: string
              example: Visit the Colosseum
            location:
              type: string
              example: Rome
            type:
              type: string
              example: Sightseeing
            notes:
              type: string
              example: Book tickets in advance
            cost:
              type: number
              example: 20.00
            rating:
              type: number
              example: 4.5
            trip_id:
              type: integer
              example: 1
    responses:
      201:
        description: Activity created
      400:
        description: Invalid input
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
    Update an activity
    ---
    tags:
      - Activities
    parameters:
      - name: activity_id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        schema:
          id: ActivityUpdate
          properties:
            name:
              type: string
            notes:
              type: string
            cost:
              type: number
    responses:
      200:
        description: Activity updated
      404:
        description: Activity not found
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
    Delete an activity
    ---
    tags:
      - Activities
    parameters:
      - name: activity_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Activity deleted
      404:
        description: Activity not found
    """
    try:
        success = db_manager.delete_activity(activity_id)
        if success:
            return jsonify({"message": "Activity deleted successfully"}), 200
        return jsonify({"error": "Activity not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
