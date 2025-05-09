from fastapi import status

def test_signup_success(client):
    response = client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_signup_duplicate_email(client):
    client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "password123"}
    )
        response = client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Email already registered" in response.json()["detail"]

def test_login_success(client):
    client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "password123"}
    )
    
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    response = client.post(
        "/auth/login",
        json={"email": "wrong@example.com", "password": "wrongpass"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED 