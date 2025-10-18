from fastapi.testclient import TestClient
from apps.backend.src.main import app


def test_notifications_flow():
    with TestClient(app) as client:
        # list
        r = client.get("/api/v1/notifications", params={"userId": "user-1", "limit": 10})
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        assert any(i["id"] == "notif-001" for i in items)
        # detail
        d = client.get("/api/v1/notifications/notif-001", params={"userId": "user-1"})
        assert d.status_code == 200, d.text
        det = d.json()
        assert det["id"] == "notif-001"
        assert "isRead" in det

        # mark read
        mr = client.post("/api/v1/notifications/notif-001/read", params={"userId": "user-1"})
        assert mr.status_code == 200, mr.text
        d2 = client.get("/api/v1/notifications/notif-001", params={"userId": "user-1"}).json()
        assert d2["isRead"] is True

        # mark all read
        mar = client.post("/api/v1/notifications/mark-all-read", params={"userId": "user-1"}, json={"onlyUnread": True})
        assert mar.status_code == 200
        assert isinstance(mar.json().get("updated"), int)

        # preferences get/update
        p = client.get("/api/v1/notifications/preferences", params={"userId": "user-1"})
        assert p.status_code == 200, p.text
        pref = p.json()
        assert "channels" in pref and "global" in pref
        new_pref = pref
        new_pref["global"]["emailFrequency"] = "weekly"
        up = client.put("/api/v1/notifications/preferences", params={"userId": "user-1"}, json=new_pref)
        assert up.status_code == 200, up.text
        assert up.json()["global"]["emailFrequency"] == "weekly"

        # delete
        dl = client.delete("/api/v1/notifications/notif-005", params={"userId": "user-1"})
        assert dl.status_code == 200
        g404 = client.get("/api/v1/notifications/notif-005", params={"userId": "user-1"})
        assert g404.status_code == 404


if __name__ == "__main__":
    test_notifications_flow()
    print("Notifications tests passed.")

