from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time


def scrape_leetcode_questions():
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    problems = []

    try:

        for page in range(1, 67):
            driver.get(f"https://leetcode.com/problemset/?page={page}")

        # Wait for the problem list to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, "[role='row']"))
            )

            # Give some time for dynamic content to load
            time.sleep(5)

            # Find all problem rows
            problem_rows = driver.find_elements(
                By.CSS_SELECTOR, "[role='row']")

            for row in problem_rows[1:]:  # Skip the header row
                try:
                    # Extract problem number and title
                    title_element = row.find_element(
                        By.CSS_SELECTOR, "div[role='cell']:nth-child(2) a")
                    problem_text = title_element.text
                    problem_link = title_element.get_attribute('href')

                    # Extract difficulty
                    difficulty_element = row.find_element(
                        By.CSS_SELECTOR, "div[role='cell']:nth-child(5) span")
                    difficulty = difficulty_element.text

                    # Extract acceptance rate
                    acceptance_element = row.find_element(
                        By.CSS_SELECTOR, "div[role='cell']:nth-child(4)")
                    acceptance_rate = acceptance_element.text

                    problems.append({
                        "problem": problem_text,
                        "link": problem_link,
                        "difficulty": difficulty,
                        "acceptance_rate": acceptance_rate
                    })
                except Exception as e:
                    print(f"Error processing row: {e}")
                    continue

    finally:
        driver.quit()

    return problems


# Run the scraper
leetcode_problems = scrape_leetcode_questions()

with open("leetcode_problems.json", "w") as f:
    import json
    json.dump(leetcode_problems, f, indent=4)

# # Print the results
# for problem in leetcode_problems:
#     print(f"Problem: {problem['problem']}")
#     print(f"Link: {problem['link']}")
#     print(f"Difficulty: {problem['difficulty']}")
#     print(f"Acceptance Rate: {problem['acceptance_rate']}")
#     print("---")
