#!/usr/bin/env python3
"""Verify the imported movie has all fields."""
import json
import urllib.request

url = 'http://localhost:8000/api/v1/movies/manual-test-complete-1'
try:
    with urllib.request.urlopen(url, timeout=10) as r:
        data = json.loads(r.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f'Error: {e}')

