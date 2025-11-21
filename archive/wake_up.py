import requests
import time

url = "https://iwm-python.onrender.com/api/v1/health"

print(f"Waking up {url}...")
start = time.time()

try:
    response = requests.get(url, timeout=120)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"Time taken: {time.time() - start:.2f}s")
except Exception as e:
    print(f"Error: {e}")
    print(f"Time taken: {time.time() - start:.2f}s")
