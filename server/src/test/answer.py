import requests

SERVER_URL = "http://localhost:8000"


def test_answer():
    test_data = {
        "question": "What is a binary search tree?"
    }

    response = requests.post(f"{SERVER_URL}/interview/answer", json=test_data)
    response.raise_for_status()
    result = response.json()
    print(result)

    with open("answer.md", "w", encoding="utf-8") as f:
        f.write(result["answer"])


if __name__ == "__main__":
    test_answer()
