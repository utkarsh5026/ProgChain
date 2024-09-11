import requests
import json


SERVER_URL = "http://localhost:8000"

# Test data
test_data = {
    "main_topic": "Python Object-Oriented Programming",
    "context": ["For beginners to advanced learners", "Focus on practical applications"]
}


def test_generate_topics():
    try:
        # Make a POST request to the server
        response = requests.post(
            f"{SERVER_URL}/topics/generate", json=test_data)

        # Check if the request was successful
        response.raise_for_status()

        # Parse the JSON response
        topics = response.json()

        print(json.dumps(topics, indent=2, ensure_ascii=False))

        assert "topics" in topics, "Response doesn't contain 'topics' key"
        assert isinstance(topics["topics"],
                          dict), "'topics' should be a dictionary"
        assert all(key in topics["topics"] for key in [
                   "beginner", "intermediate", "advanced"]), "Missing difficulty levels"

        print("Test passed successfully!")

    except requests.exceptions.RequestException as e:
        print(f"Error making request to server: {e}")
    except json.JSONDecodeError:
        print("Error decoding JSON response")
    except AssertionError as e:
        print(f"Test failed: {e}")


if __name__ == "__main__":
    test_generate_topics()
