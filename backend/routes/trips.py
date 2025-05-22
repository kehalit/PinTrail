from flask import Blueprint, request, jsonify, current_app
from backend.utils.validates import validate_fields

trips_bp = Blueprint('trips', __name__, url_prefix='/trips')


@trips_bp.route("/add_trip", methods=["POST"])
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

        db = current_app.config["db_manager"]
        new_trip = db.add_trip(data)

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


@trips_bp.route("/", methods=["GET"])
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
        db = current_app.config["db_manager"]
        trips = db.get_trips()
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


@trips_bp.route("/<int:trip_id>", methods=["GET"])
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
        db = current_app.config["db_manager"]
        trip = db.get_trip_by_id(trip_id)
        if trip:
            return jsonify(trip.to_dict()), 200
        else:
            return jsonify({"error": "Trip not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@trips_bp.route('/<int:trip_id>', methods=['PUT'])
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
        db = current_app.config["db_manager"]
        updated_trip = db.update_trip(trip_id, data)
        if updated_trip:
            return jsonify(updated_trip.to_dict()), 200
        else:
            return jsonify({"error": "Trip not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@trips_bp.route('/<int:trip_id>', methods=['DELETE'])
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
    db = current_app.config["db_manager"]
    success = db.delete_trip(trip_id)
    if success:
        return jsonify({"message": f"Trip {trip_id} deleted successfully."}), 200
    else:
        return jsonify({"error": f"Trip {trip_id} not found."}), 404