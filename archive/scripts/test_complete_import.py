#!/usr/bin/env python3
"""Test complete movie import with all fields."""
import json
import urllib.request
import urllib.error

payload = [{
    'external_id': 'manual-test-complete-1',
    'title': 'The Complete Test Movie',
    'year': '2024',
    'release_date': '2024-06-15',
    'runtime': 145,
    'rating': 'PG-13',
    'language': 'English',
    'country': 'USA',
    'overview': 'A complete test movie with all fields populated.',
    'poster_url': 'https://via.placeholder.com/300x450',
    'backdrop_url': 'https://via.placeholder.com/1280x720',
    'budget': 50000000,
    'revenue': 200000000,
    'status': 'released',
    'genres': ['Drama', 'Thriller'],
    'directors': [{'name': 'Test Director'}],
    'cast': [{'name': 'Test Actor', 'character': 'Lead Role'}],
    'streaming': [{'platform': 'Netflix', 'region': 'US', 'type': 'subscription', 'url': 'https://netflix.com'}],
    'awards': [{'name': 'Golden Globes', 'year': 2024, 'category': 'Best Drama', 'status': 'Winner'}],
    'trivia': [{'question': 'How long did filming take?', 'category': 'Production', 'answer': '6 months', 'explanation': 'Shot across multiple locations'}],
    'timeline': [{'date': '2023-01-01', 'title': 'Production Start', 'description': 'Filming begins', 'type': 'Production Start'}]
}]

body = json.dumps(payload).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/v1/admin/movies/import', data=body, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        print('Status:', r.status)
        result = json.loads(r.read().decode())
        print(json.dumps(result, indent=2))
except urllib.error.HTTPError as e:
    print('HTTP', e.code)
    print(e.read().decode())

