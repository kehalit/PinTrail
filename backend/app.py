import os
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager
from flasgger import Swagger
from flask_cors import CORS
from datetime import timedelta
from datamanager.sqllite_data_manager import SQLiteDataManager
from routes.activities import activities_bp
from routes.trips import trips_bp
from routes.users import users_bp
from routes.photos import photos_bp
from dotenv import load_dotenv
from routes.chat import chat_bp
from supabase import create_client, Client



load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_BUCKET_NAME = os.getenv("SUPABASE_BUCKET_NAME")
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("SUPABASE_URL or SUPABASE_KEY is not set in environment variables.")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

from flask import send_from_directory


app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=3600)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

app.config["SUPABASE_URL"] = SUPABASE_URL
app.config["supabase"] = supabase_client
app.config["SUPABASE_BUCKET_NAME"] = SUPABASE_BUCKET_NAME


# allow all origins
CORS(app,
     origins = [ "http://localhost:5173","https://pin-trail.vercel.app/"], # set exact frontend origin instead of *
     allow_credentials=True,
     allow_headers= ["*"],
     allow_methods=["*"])


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
app.register_blueprint(photos_bp)
app.register_blueprint(chat_bp)

@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory('uploads', filename)


@jwt.unauthorized_loader
def custom_unauthorized_response(callback):
    return jsonify({"error": "Missing or invalid token"}), 401

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return db_manager.is_token_blacklisted(jti)

@jwt.invalid_token_loader
def custom_invalid_token_response(callback):
    print(f"Invalid token received: {request.headers.get('Authorization')}")
    return jsonify({"error": "Invalid token", "reason": str(callback)}), 422


@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401


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





if __name__ == "__main__":
    app.run(debug=True)