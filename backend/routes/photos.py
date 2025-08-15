
from flask import Blueprint, request, jsonify, current_app

photos_bp = Blueprint('photos', __name__, url_prefix='/photos')


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@photos_bp.route("/upload/<int:trip_id>", methods=["POST"])
# @jwt_required()
def upload_photo(trip_id):
    try:
        # current_user_id = int(get_jwt_identity())
        db = current_app.config["db_manager"]
        trip = db.get_trip_by_id(trip_id)
        if not trip:
            return jsonify({"error": "Trip not found or unauthorized"}), 404

        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        MAX_FILE_SIZE = 5 * 1024 * 1024
        if file.content_length and file.content_length > MAX_FILE_SIZE:
            return jsonify({"error": "File too large"}), 400

        photo_data = {
            "trip_id": trip_id,
            "file": file,
            "caption": request.form.get("caption", "")
        }

        new_photo = db.add_photo(photo_data)
        return jsonify(new_photo.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400



@photos_bp.route("/", methods=["GET"])
def get_photos():
    """
    Get all photos
    ---
    tags:
      - Photos
    responses:
      200:
        description: A list of photos
      500:
        description: Server error
    """
    try:
        db = current_app.config["db_manager"]
        photos = db.get_photos()
        return jsonify(photos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@photos_bp.route('/<int:photo_id>', methods=['GET'])
def get_photo(photo_id):
    """
    Get a photo by ID
    ---
    tags:
      - Photos
    parameters:
      - name: photo_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Photo found
      404:
        description: Photo not found
    """
    db = current_app.config["db_manager"]
    photo = db.get_photo_by_id(photo_id)
    if photo:
        return jsonify(photo.to_dict()), 200
    return jsonify({"error": "Photo not found"}), 404

@photos_bp.route('/trip/<int:trip_id>', methods=['GET'])
def get_photos_by_trip_id(trip_id):
    """
    Get photos by trip ID
    ---
    tags:
      - Photos
    parameters:
      - name: trip_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: A list of photos for the trip
      500:
        description: Server error
    """
    try:
        db = current_app.config["db_manager"]
        photos = db.get_photos_by_trip_id(trip_id)
        return jsonify(photos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@photos_bp.route('', methods=['POST'])
def create_photo():
    """
    Create a new photo
    ---
    tags:
      - Photos
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: Photo
          required:
            - url
            - trip_id
          properties:
            url:
              type: string
              example: https://example.com/photo.jpg
            caption:
              type: string
              example: Beautiful sunset
            trip_id:
              type: integer
              example: 1
    responses:
      201:
        description: Photo created
      400:
        description: Invalid input
    """
    try:
        photo_data = request.json
        db = current_app.config["db_manager"]
        new_photo = db.add_photo(photo_data)
        return jsonify(new_photo.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@photos_bp.route('/<int:photo_id>', methods=['PUT'])
def update_photo(photo_id):
    """
    Update a photo
    ---
    tags:
      - Photos
    parameters:
      - name: photo_id
        in: path
        type: integer
        required: true
      - in: body
        name: body
        schema:
          id: PhotoUpdate
          properties:
            url:
              type: string
            caption:
              type: string
    responses:
      200:
        description: Photo updated
      404:
        description: Photo not found
    """
    try:
        updates = request.json
        db = current_app.config["db_manager"]
        updated_photo = db.update_photo(photo_id, updates)
        if updated_photo:
            return jsonify(updated_photo.to_dict()), 200
        return jsonify({"error": "Photo not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@photos_bp.route('/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    """
    Delete a photo
    ---
    tags:
      - Photos
    parameters:
      - name: photo_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Photo deleted
      404:
        description: Photo not found
    """
    try:
        db = current_app.config["db_manager"]
        success = db.delete_photo(photo_id)
        if success:
            return jsonify({"message": "Photo deleted successfully"}), 200
        return jsonify({"error": "Photo not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500