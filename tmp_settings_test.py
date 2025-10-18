from fastapi.testclient import TestClient
from apps.backend.src.main import app


def test_settings_flow():
    with TestClient(app) as client:
        # get all
        r = client.get("/api/v1/settings", params={"userId": "user-1"})
        assert r.status_code == 200, r.text
        all_settings = r.json()
        for key in [
            "account",
            "profile",
            "privacy",
            "display",
            "preferences",
            "security",
            "integrations",
            "data",
        ]:
            assert key in all_settings

        # update privacy
        upd_priv = {"profileVisibility": "private", "activitySharing": False}
        r2 = client.put("/api/v1/settings/privacy", params={"userId": "user-1"}, json=upd_priv)
        assert r2.status_code == 200, r2.text
        resp2 = r2.json()
        print("PUT privacy resp:", resp2)
        assert resp2["profileVisibility"] == "private"
        assert resp2["activitySharing"] is False

        # verify persistence via get
        g2 = client.get("/api/v1/settings/privacy", params={"userId": "user-1"})
        assert g2.status_code == 200
        print("GET privacy after update:", g2.json())
        assert g2.json()["profileVisibility"] == "private"

        # update display
        upd_disp = {"theme": "light", "fontSize": "large"}
        r3 = client.put("/api/v1/settings/display", params={"userId": "user-1"}, json=upd_disp)
        assert r3.status_code == 200
        assert r3.json()["theme"] == "light"
        assert r3.json()["fontSize"] == "large"

        # update preferences
        upd_pref = {"language": "fr", "region": "fr", "hideSpoilers": False, "contentRating": "pg13"}
        r4 = client.put("/api/v1/settings/preferences", params={"userId": "user-1"}, json=upd_pref)
        assert r4.status_code == 200
        assert r4.json()["language"] == "fr"
        assert r4.json()["contentRating"] == "pg13"

        # update all in single call
        r5 = client.put(
            "/api/v1/settings",
            params={"userId": "user-1"},
            json={"security": {"twoFactorEnabled": True, "loginNotifications": False}},
        )
        assert r5.status_code == 200
        assert r5.json()["security"]["twoFactorEnabled"] is True
        assert r5.json()["security"]["loginNotifications"] is False


if __name__ == "__main__":
    test_settings_flow()
    print("Settings tests passed.")

