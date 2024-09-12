import requests
import json

SERVER_URL = "http://localhost:8000"

# Test data
test_data = {
    "topic": "Python Data Structures",
    "context": "Entry-level software developer position focusing on backend development"
}


def test_interview():
    try:
        # Make a POST request to the server
        response = requests.post(f"{SERVER_URL}/interview/", json=test_data)

        # Check if the request was successful
        response.raise_for_status()

        # Parse the JSON response
        result = response.json()

        print(json.dumps(result, indent=2, ensure_ascii=False))

        assert "questions" in result, "'questions' key should be in the response"
        assert isinstance(result["questions"],
                          list), "'questions' should be a list"
        assert len(result["questions"]) == 10, "Expected 10 questions"

        for question in result["questions"]:
            assert "question" in question, "'question' key should be in each question"
            assert "type" in question, "'type' key should be in each question"
            assert "difficulty" in question, "'difficulty' key should be in each question"

        print("All assertions passed successfully!")
    except requests.exceptions.RequestException as e:
        print(f"Request to the server failed: {e}")
        raise
    except AssertionError as e:
        print(f"Assertion failed: {e}")
        raise


if __name__ == "__main__":
    test_interview()
