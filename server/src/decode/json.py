import json


def decode_json(text: str) -> dict:
    """
    Decode JSON string from text, with robust error handling.

    Args:
        text: String that contains JSON data
    Returns:
        Parsed JSON as dictionary
    Raises:
        ValueError: If JSON is invalid or cannot be found in text
    """
    if not text or not isinstance(text, str):
        raise ValueError("Input must be a non-empty string")

    start = text.find('{')
    end = text.rfind('}')

    if start == -1 or end == -1:
        raise ValueError(
            f"No valid JSON object found - missing brackets. Text preview: '{
                text[:50]}...'"
        )

    if end <= start:
        raise ValueError(
            "Invalid JSON structure - closing bracket appears before opening bracket")

    json_str = text[start:end + 1]

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {str(e)}. JSON string: '{
                         json_str[:100]}...'") from e
