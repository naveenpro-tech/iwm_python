from fastapi.testclient import TestClient
from apps.backend.src.main import app


def test_list_and_detail():
    with TestClient(app) as client:
        # List default
        r = client.get("/api/v1/talent-hub/calls", params={"limit": 5})
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        assert any(i["projectTitle"] == "Shadow of the Valley" for i in items)

        # Filter by projectType
        r2 = client.get("/api/v1/talent-hub/calls", params={"projectType": "tv-series"})
        assert r2.status_code == 200, r2.text
        data2 = r2.json()
        assert all(i["projectType"] == "tv-series" for i in data2)

        # Detail
        r3 = client.get("/api/v1/talent-hub/calls/call-feature-1")
        assert r3.status_code == 200, r3.text
        d = r3.json()
        assert d["id"] == "call-feature-1"
        assert isinstance(d.get("roles", []), list)
        assert d.get("submissionGuidelines") is not None


if __name__ == "__main__":
    test_list_and_detail()
    print("Talent Hub tests passed.")

