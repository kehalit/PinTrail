from flask import Blueprint, request, jsonify, current_app
from flasgger import Swagger
from backend.datamanager.sqllite_data_manager import SQLiteDataManager



activites_bp = Blueprint('activities', __name__)
@activites_bp.route("/", methods=["GET"])
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
        db = current_app.config["db_manager"]
        activities = db.get_activities()
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@activites_bp.route('/<int:activity_id>', methods=['GET'])
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
    db = current_app.config["db_manager"]
    activity = db.get_activity_by_id(activity_id)
    if activity:
        return jsonify(activity.to_dict()), 200
    return jsonify({"error": "Activity not found"}), 404

@activites_bp.route('/trip/<int:trip_id>', methods=['GET'])
def get_activities_by_trip_id(trip_id):
    """
    Get activities by trip ID
    ---
    tags:
      - Activities
    parameters:
      - name: trip_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: A list of activities for the trip
      500:
        description: Server error
    """
    try:
        db = current_app.config["db_manager"]
        activities = db.get_activities_by_trip_id(trip_id)
        return jsonify(activities), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@activites_bp.route('/', methods=['POST'])
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
        db = current_app.config["db_manager"]
        new_activity = db.add_activity(activity_data)
        return jsonify(new_activity.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@activites_bp.route('/<int:activity_id>', methods=['PUT'])
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
        db = current_app.config["db_manager"]
        updated_activity = db.update_activity(activity_id, updates)
        if updated_activity:
            return jsonify(updated_activity.to_dict()), 200
        return jsonify({"error": "Activity not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@activites_bp.route('/<int:activity_id>', methods=['DELETE'])
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
        db = current_app.config["db_manager"]
        success = db.delete_activity(activity_id)
        if success:
            return jsonify({"message": "Activity deleted successfully"}), 200
        return jsonify({"error": "Activity not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500