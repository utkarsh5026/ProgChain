import requests
import json

BASE_URL = "http://localhost:8000/quiz/generate"


def test_quiz():
    response = requests.post(BASE_URL, json={
        "topic": "Python",
        "count": 2,
        "levels": ["easy", "medium", "hard"],
        "instructions": "Create a quiz on Python programming language"
    })

    print(response)

    assert response.status_code == 200

    quiz = response.json()
    print(json.dumps(quiz, indent=2))

    with open("quiz.json", "w") as f:
        json.dump(quiz, f, indent=2)


if __name__ == "__main__":
    test_quiz()
