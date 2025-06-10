import pytest
from backend import app
from backend.datamanager.sqllite_data_manager import db


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_add_trip_success(client):
    response = client.post('/add_trip', json={
        "title": "Test Trip",
        "user_id": 1,
        "country": "France",
        "city": "Paris",
        "start_date": "2024-07-01",
        "end_date": "2024-07-10",
        "description": "Test Description",
        "notes": "Test Notes",
        "is_public": True,
        "activities": [
            {
                "name": "Eiffel Tower Visit",
                "type": "Sightseeing",
                "location": "Paris"
            }
        ]
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["title"] == "Test Trip"
