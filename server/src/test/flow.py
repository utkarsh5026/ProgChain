import requests


def test_flow():
    data = {
        "topic": "Python",
        "difficulty": "Beginner",
    }
    response = requests.get("http://localhost:8000/api/flow", json=data)

    print(response.json())
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}


if __name__ == "__main__":
    test_flow()
