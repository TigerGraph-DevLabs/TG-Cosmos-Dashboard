from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_item():
    response = client.post(
        "http://127.0.0.1:8010/saveConnections",
        "srt"
    )
    return response.json()

print(test_create_item())
