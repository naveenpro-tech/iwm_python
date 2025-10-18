import json
import os
import sys
import urllib.request
import urllib.error

URL = "http://localhost:8000/api/v1/admin/movies/enrich"
QUERY = sys.argv[1] if len(sys.argv) > 1 else "Dune: Part Two"
PROVIDER = (sys.argv[2] if len(sys.argv) > 2 else None) or os.environ.get("PROVIDER")

def main():
    payload = {"query": QUERY}
    if PROVIDER:
        payload["provider"] = PROVIDER
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8")
            print(body)
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code}")
        try:
            print(e.read().decode("utf-8"))
        except Exception:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

