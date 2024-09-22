from memory_profiler import profile
import json
import os


@profile
def load_json():
    file_path = os.path.join(os.path.dirname(
        __file__), '..',  'leetcode_problems.json')
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data


if __name__ == '__main__':
    loaded_data = load_json()
    print(f"Loaded {len(loaded_data)} items")
