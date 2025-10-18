from fastapi.testclient import TestClient
from apps.backend.src.main import app


def test_admin_endpoints():
    with TestClient(app) as client:
        # Users list
        r = client.get("/api/v1/admin/users", params={"limit": 10})
        assert r.status_code == 200, r.text
        users = r.json()
        assert isinstance(users, list)
        assert any(u["id"] == "user-1" for u in users)

        # Moderation list
        r2 = client.get("/api/v1/admin/moderation/items")
        assert r2.status_code == 200, r2.text
        mods = r2.json()
        assert isinstance(mods, list)
        if mods:
            mod_id = mods[0]["id"]
            # Approve first item
            r3 = client.post(f"/api/v1/admin/moderation/items/{mod_id}/approve", json={"reason": "cleared"})
            assert r3.status_code == 200, r3.text

        # Settings get and update
        r4 = client.get("/api/v1/admin/system/settings")
        assert r4.status_code == 200
        data = r4.json()
        data["general"]["siteName"] = "CineVerse Test"
        r5 = client.put("/api/v1/admin/system/settings", json={"data": data})
        assert r5.status_code == 200
        data2 = r5.json()
        assert data2["general"]["siteName"] == "CineVerse Test"

        # Analytics overview
        r6 = client.get("/api/v1/admin/analytics/overview")
        assert r6.status_code == 200
        ov = r6.json()
        assert set(["totalUsers","contentViews","avgRating","systemHealth"]).issubset(ov.keys())


if __name__ == "__main__":
    test_admin_endpoints()
    print("Admin tests passed.")

