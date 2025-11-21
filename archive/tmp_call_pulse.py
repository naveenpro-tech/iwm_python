from apps.backend.src.main import app
from fastapi.testclient import TestClient

with TestClient(app) as client:
    r1 = client.get('/api/v1/pulse', params={'filter':'latest','limit':5})
    print('GET /api/v1/pulse ->', r1.status_code)
    print(r1.json())
    r2 = client.get('/api/v1/pulse/trending-topics', params={'limit':10})
    print('GET /api/v1/pulse/trending-topics ->', r2.status_code)
    print(r2.json())

