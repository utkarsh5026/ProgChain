import requests
import json

SERVER_URL = "http://localhost:8000"

# Test data
test_data = {
    "question": "What is a binary search tree?"
}


def test_explore():
    try:
        # Make a POST request to the server
        response = requests.post(f"{SERVER_URL}/explore/", json=test_data)

        # Check if the request was successful
        response.raise_for_status()

        # Parse the JSON response
        result = response.json()

        print(json.dumps(result, indent=2, ensure_ascii=False))

        with open("test_explore.json", "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        assert "explanation" in result, "Response doesn't contain 'explanation' key"
        assert isinstance(result["explanation"],
                          str), "'explanation' should be a string"
        assert len(result["explanation"]
                   ) > 0, "Explanation should not be empty"

        assert "follow_up_questions" in result, "Response doesn't contain 'follow_up_questions' key"
        assert isinstance(result["follow_up_questions"],
                          list), "'follow_up_questions' should be a list"
        assert len(result["follow_up_questions"]
                   ) == 10, "There should be 10 follow-up questions"

        print("Test passed successfully!")

    except requests.exceptions.RequestException as e:
        print(f"Error making request to server: {e}")
    except json.JSONDecodeError:
        print("Error decoding JSON response")
    except AssertionError as e:
        print(f"Test failed: {e}")


if __name__ == "__main__":
    test_explore()
