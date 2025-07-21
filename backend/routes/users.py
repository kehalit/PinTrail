from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token, \
    get_jwt
from sqlalchemy.testing.suite.test_reflection import users

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('/login', methods=['POST'])
def login_user():
    """
    Log in a user
    ---
    tags:
      - Users
    parameters:
      - in: body
        name: body
        required: true
        schema:
          id: Login
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: johndoe@example.com
            password:
              type: string
              example: secret123
    responses:
      200:
        description: Login successful
      401:
        description: Invalid credentials
    """

    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Missing email or password'}), 400

        db = current_app.config["db_manager"]
        user = db.get_user_by_email(email)

        if not user or not db.verify_password(user, password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # access_token = create_access_token(identity={"id": user.id, "email": user.email})
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=(user.id))

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
                }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@users_bp.route('/logout', methods= ['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    db = current_app.config["db_manager"]
    db.blacklist_token(jti)
    return  jsonify({"message": "Succesfully logged out"}), 200


@users_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():
    user_id = get_jwt_identity()
    db = current_app.config['db_manager']
    user = db.get_user_by_id(int(user_id))
    if user:
        return jsonify({
            "message": "JWT is valid",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }), 200
    return jsonify({"error": "User not found"}), 404


@users_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify(access_token=new_access_token), 200



@users_bp.route('/', methods=['POST', 'OPTIONS'])
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
    if request.method == 'OPTIONS':
        # This responds to the CORS preflight request
        return jsonify({}), 200
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        db = current_app.config["db_manager"]
        new_user = db.add_user(username, email, password)

        return jsonify({
            'id': new_user.id,
            'username': new_user.username,
            'email': new_user.email
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/', methods=['GET'])
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
    db = current_app.config["db_manager"]
    users = db.get_all_users()
    return jsonify([
        { "id": user.id, "username": user.username, "email": user.email}
        for user in users
    ])


@users_bp.route('/<int:user_id>', methods=['GET'])
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
    db = current_app.config["db_manager"]
    user = db.get_user_by_id(user_id)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
    return jsonify({"error": "User not found"}), 404


@users_bp.route('/<int:user_id>', methods=['PUT'])
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
    db = current_app.config["db_manager"]
    user = db.update_user(user_id, data)
    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
    return jsonify({"error": "User not found"}), 404


@users_bp.route('/<int:user_id>', methods=['DELETE'])
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
    db = current_app.config("db_manager")
    if db.delete_user(user_id):
        return jsonify({"message": "User deleted"})
    return jsonify({"error": "User not found"}), 404