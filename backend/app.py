from flask import Flask, jsonify, render_template, request, redirect, url_for, flash, session
from flasgger import Swagger
from flask_cors import CORS
from datamanager.sqllite_data_manager import SQLiteDataManager
from routes.activities import activities_bp
from routes.trips import trips_bp
from routes.users import users_bp



app = Flask(__name__)
# allow all origins
CORS(app, supports_credentials=True)


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
