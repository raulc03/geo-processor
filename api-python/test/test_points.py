import pytest
from fastapi.testclient import TestClient
from api_python.main import app

client = TestClient(app)

API_URL = "/api/points"


def test_valid_points():
    """Test API with valid points: expects 200 and correct centroid/bounds."""
    res = client.post(
        API_URL,
        json={"points": [{"lat": 0.0, "lng": 0.0}, {"lat": -45.2, "lng": 80.5}]},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["centroid"]["lat"] == -22.6
    assert data["centroid"]["lng"] == 40.25
    assert data["bounds"]["north"] == 0
    assert data["bounds"]["south"] == -45.2
    assert data["bounds"]["east"] == 80.5
    assert data["bounds"]["west"] == 0


def test_empty_points():
    """Test API with empty points list: expects 400 and too_short error."""
    res = client.post(API_URL, json={"points": []})
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "too_short"
    assert error["msg"] == "List should have at least 1 item after validation, not 0"


def test_no_points():
    """Test API with missing points key: expects 400 and missing error."""
    res = client.post(API_URL, json={})
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "missing"
    assert error["msg"] == "Body does not include the required 'points' value"


def test_invalid_type_points():
    """Test API with points as wrong type (string): expects 400 and list_type error."""
    res = client.post(API_URL, json={"points": "not a list"})
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "list_type"
    assert error["msg"] == "Input should be a valid list"


def test_not_dict_points():
    """Test API with points as list of non-dict: expects 400 and model_attributes_type error."""
    res = client.post(API_URL, json={"points": ["not an object"]})
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "model_attributes_type"
    assert (
        error["msg"]
        == "Input should be a valid dictionary or object to extract fields from"
    )


@pytest.mark.parametrize(
    "data",
    [
        {"points": [{"lat": "abc", "lng": 56.78}]},
        {"points": [{"lat": 12.34, "lng": "xyz"}]},
        {"points": [{"lat": 10, "lng": 20}, {"lat": "bad", "lng": 30}]},
    ],
)
def test_invalid_points(data):
    """Test API with points containing invalid types: expects 400 and float_parsing error."""
    res = client.post(API_URL, json=data)
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "float_parsing"
    assert (
        error["msg"]
        == "Input should be a valid number, unable to parse string as a number"
    )


def test_missing_latitude():
    """Test API with point missing latitude: expects 400 and missing error."""
    res = client.post(API_URL, json={"points": [{"lng": 56.78}]})
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "missing"
    assert error["msg"] == "Point 0 does not include the required 'latitude' value"


def test_missing_longitude():
    """Test API with point missing longitude: expects 400 and missing error."""
    res = client.post(API_URL, json={"points": [{"lat": 12.34}]})
    assert res.status_code == 400
    error = res.json()["detail"][0]
    assert error["type"] == "missing"
    assert error["msg"] == "Point 0 does not include the required 'longitude' value"
