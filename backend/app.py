from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from flasgger import Swagger
from flask_cors import CORS
from datetime import timedelta
from datamanager.sqllite_data_manager import SQLiteDataManager
from routes.activities import activities_bp
from routes.trips import trips_bp
from routes.users import users_bp



app = Flask(__name__)
app.config['SECRET_KEY'] = "super-secret-key"
app.config['JWT_SECRET_KEY'] = "super-secret-jwt-key"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=3600)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)


# allow all origins
CORS(app, supports_credentials=True)



jwt = JWTManager(app)
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "PinTrail API",
        "description": "API documentation for the PinTrail travel app",
        "version": "1.0"
    }
})
db_manager = SQLiteDataManager(app)
app.config["db_manager"] = db_manager


app.register_blueprint(activities_bp)
app.register_blueprint(trips_bp)
app.register_blueprint(users_bp)


@jwt.unauthorized_loader
def custom_unauthorized_response(callback):
    return jsonify({"error": "Missing or invalid token"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(callback):
    print(f"Invalid token received: {request.headers.get('Authorization')}")
    return jsonify({"error": "Invalid token", "reason": str(callback)}), 422


@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

@app.before_request
def log_request_info():
    print(f"Request headers: {request.headers}")


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

@app.before_request
def log_request_info():
    print("Authorization header:", request.headers.get('Authorization'))



if __name__ == "__main__":
    app.run(debug=True)