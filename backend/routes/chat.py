from flask import Flask, Blueprint, request, jsonify

chat_bp = Blueprint("chat", __name__)

# Menu structure
MENU = {
    "start": {
        "message": "Hi! How can I help you today? Choose an option:",
        "options": [
            "Account",
            "Trips",
            "Photos"
        ]
    },
    "Account": {
        "message": "Account options:",
        "options": ["How to sign up", "Back to main menu"]
    },
    "How to sign up": {
        "message": "To sign up, go to /register",
        "options": ["Back to Account menu", "Back to main menu"]
    },
    "Trips": {
        "message": "Trips options:",
        "options": ["Add a trip", "Edit a trip", "Delete a trip", "Back to main menu"]
    },
    "Add a trip": {
        "message": "To add a trip, go to /add-trip and fill in the details.",
        "options": ["Back to Trips menu", "Back to main menu"]
    },
    "Edit a trip": {
        "message": "To edit a trip, go to /my-trips and click 'Edit'.",
        "options": ["Back to Trips menu", "Back to main menu"]
    },
    "Delete a trip": {
        "message": "To delete a trip, go to /my-trips and click 'Delete'.",
        "options": ["Back to Trips menu", "Back to main menu"]
    },
    "Photos": {
        "message": "Photo options:",
        "options": ["How to add photos", "Back to main menu"]
    },
    "How to add photos": {
        "message": "Add photos when creating or editing a trip. Click 'Add Photo'.",
        "options": ["Back to Photos menu", "Back to main menu"]
    },
    "Back to main menu": "start",
    "Back to Account menu": "Account",
    "Back to Trips menu": "Trips",
    "Back to Photos menu": "Photos"
}

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    last_choice = data.get("last_choice", "start")

    # Follow redirects like "Back to main menu"
    if last_choice in MENU and isinstance(MENU[last_choice], str):
        last_choice = MENU[last_choice]

    reply_data = MENU.get(last_choice, MENU["start"])

    return jsonify({
        "reply": {
            "role": "bot",
            "content": reply_data["message"],
            "options": reply_data.get("options", [])
        }
    })


