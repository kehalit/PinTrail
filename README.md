# PinTrail

PinTrail is a full-stack travel journaling application. It provides user authentication, trip management, and activity tracking, built with a **Flask backend** and a **React frontend**.

---

## Requirements

- **Python** ≥ 3.10  
- **Node.js** ≥ 18  
- **SQLite** (bundled with Python, no separate install required)  
- Recommended: **virtualenv** for Python dependency isolation  

---

## Setup

###  Clone the repository

git clone https://github.com/your-username/pintrail.git
cd pintrail

###  Backend (Flask API)
- cd backend
- python -m venv venv
- source venv/bin/activate   # Windows: venv\Scripts\activate
- pip install -r requirements.txt
- flask run
- 
  By default, the backend will be available at: http://127.0.0.1:5000

###  Frontend (React app)
cd frontend
npm install
npm start

The frontend will start on: http://localhost:3000

## Database

PinTrail uses **SQLite** for local development.

### Tables
- **users** → stores user accounts (`id, username, email, password, created_at`)
- **trips** → stores trip data (`id, user_id, title, location, likes, created_at`)
- **activities** → stores activities linked to trips (`id, trip_id, description, created_at`)

SQLite will create a `.db` file automatically in the backend folder on first run.

---

## API Overview

### Users
- `POST /users/` → Register user  
- `POST /login/` → Authenticate  
- `GET /users/<id>` → Fetch user info  

### Trips
- `GET /trips/user/<user_id>` → Get trips for a user  
- `POST /trips/` → Create new trip  

### Activities
- `GET /activities/trip/<trip_id>` → Get activities for a trip  
- `POST /activities/` → Add activity to a trip  

---

## Development Notes

- **AuthContext** (React) manages authentication state client-side.  
- **Profile page** displays user stats and recent trips; if the user has no trips, an **“Add Trip”** button links to `/dashboard`.  
- **created_at** timestamps are handled server-side, not passed from the frontend.  
- Error handling returns JSON with an `error` field and proper status codes (`400, 401, 500`).  

---

## Contributing

1. Fork the repo  
2. Create a feature branch  
   git checkout -b feature/new-thing


















