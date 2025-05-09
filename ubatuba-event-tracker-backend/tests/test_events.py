from fastapi import status
from datetime import datetime, timedelta

def get_auth_headers(client):
    response = client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_create_event(client):
    headers = get_auth_headers(client)
    event_data = {
        "title": "Test Event",
        "description": "Test Description",
        "date": (datetime.now() + timedelta(days=1)).isoformat(),
        "location": "Test Location",
        "category": "Test Category"
    }
    
    response = client.post("/events", json=event_data, headers=headers)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["title"] == event_data["title"]

def test_get_events(client):
    response = client.get("/events")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list) 