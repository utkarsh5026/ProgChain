from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException
from multiprocessing import Pool, cpu_count
from concurrent.futures import ThreadPoolExecutor
import time
import json
import os


def setup_driver():
    """
    Set up and configure a Chrome WebDriver for web scraping.

    Returns:
        webdriver.Chrome: A configured Chrome WebDriver instance.
    """
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)


def wait_and_find(driver, by, value, timeout=10):
    """
    Wait for an element to be present on the page and return it.

    Args:
        driver (webdriver.Chrome): The WebDriver instance.
        by (selenium.webdriver.common.by.By): The method to locate the element.
        value (str): The value to search for.
        timeout (int, optional): Maximum time to wait for the element. Defaults to 10 seconds.

    Returns:
        WebElement or None: The found element, or None if not found within the timeout.
    """
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
        return element
    except TimeoutException:
        print(f"Timeout waiting for element: {value}")
        return None


def get_description(driver):
    """
    Extract the problem description from the LeetCode problem page.

    Args:
        driver (webdriver.Chrome): The WebDriver instance.

    Returns:
        str: The extracted problem description.
    """
    description = ""
    description_div = wait_and_find(driver, By.CLASS_NAME, "elfjS")
    if description_div:
        p_tags = description_div.find_elements(By.TAG_NAME, "p")
        for p in p_tags:
            if "&nbsp;" == p.get_attribute('innerHTML'):
                break
            description += p.get_attribute('innerHTML') + "\n\n"

    return description


def get_tags(driver):
    """
    Extract tags associated with the LeetCode problem.

    Args:
        driver (webdriver.Chrome): The WebDriver instance.

    Returns:
        list: A list of dictionaries containing tag names and URLs.
    """
    tags = []
    possible_tag_selectors = [
        "a[href^='/tag/']",
    ]

    for selector in possible_tag_selectors:
        elements = driver.find_elements(By.CSS_SELECTOR, selector)
        print(selector)
        for elem in elements:
            tag_text = elem.get_attribute('innerHTML')
            tag_href = elem.get_attribute('href')

            print("tag", tag_text, tag_href)
            if tag_text and not any(tag['name'] == tag_text for tag in tags):
                tags.append({"name": tag_text, "url": tag_href})

    return tags


def scrape_leetcode_problem(problem_url):
    """
    Scrape details of a LeetCode problem from its URL.

    Args:
        problem_url (str): The URL of the LeetCode problem.

    Returns:
        dict or None: A dictionary containing the problem description and tags,
                      or None if an error occurs during scraping.
    """
    driver = setup_driver()
    try:
        driver.get(problem_url)
        time.sleep(5)

        description = get_description(driver)
        tags = get_tags(driver)

        return {
            "description": description,
            "tags": tags
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

    finally:
        driver.quit()


def scrape_and_save(problem):
    """
    Scrape a single problem and save its details to a JSON file.
    """
    idx, problem = problem
    print(f"Scraping problem {idx}")
    problem_url = problem.get("link")
    if not problem_url:
        print(f"Error: No URL found for problem {idx}")
        return

    max_retries = 3
    for attempt in range(max_retries):
        try:
            problem_details = scrape_leetcode_problem(problem_url)
            if problem_details:
                print(f"Scraped details for {problem_url}")
                problem_title = problem.get("problem", "").replace(" ", "_")
                file_name = f"leetcode_problems/{idx + 1}_{problem_title}.json"
                os.makedirs(os.path.dirname(file_name), exist_ok=True)
                with open(file_name, "w") as file:
                    json.dump(problem_details, file, indent=4)
                print(f"Saved to {file_name}")
                return
            else:
                print(f"Failed to scrape details for {problem_url}")
        except Exception as e:
            print(f"Error scraping problem {idx}: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying... (Attempt {attempt + 2}/{max_retries})")
                time.sleep(5)  # Wait for 5 seconds before retrying
            else:
                print(f"Max retries reached for problem {idx}")


def scrape_problem_details():
    """
    Scrape details for all LeetCode problems listed in the JSON file using multiprocessing.
    """
    try:
        with open("leetcode_problems.json", "r") as file:
            problems = json.load(file)
    except FileNotFoundError:
        print("Error: leetcode_problems.json file not found")
        return
    except json.JSONDecodeError:
        print("Error: Invalid JSON in leetcode_problems.json")
        return

    # Use all available CPU cores, but limit to a maximum of 4
    num_processes = min(4, cpu_count())

    try:
        with Pool(num_processes) as pool:
            pool.map(scrape_and_save, enumerate(problems))
    except Exception as e:
        print(f"Error in multiprocessing: {str(e)}")


if __name__ == "__main__":
    scrape_problem_details()
