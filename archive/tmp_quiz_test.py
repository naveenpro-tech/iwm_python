from pprint import pprint
from fastapi.testclient import TestClient
from apps.backend.src.main import app

base = "/api/v1"

with TestClient(app) as client:
    print("GET /quizzes")
    r = client.get(f"{base}/quizzes", params={"limit": 5})
    print(r.status_code)
    qs = r.json()
    print(len(qs))
    first = qs[0]
    pprint(first)

    qid = "quiz-inception"
    print("GET /quizzes/{id}")
    r = client.get(f"{base}/quizzes/{qid}")
    print(r.status_code)
    pprint(r.json()["questions"][0])

    print("POST /quizzes/{id}/start")
    r = client.post(f"{base}/quizzes/{qid}/start", json={"userId": "user-1"})
    print(r.status_code)
    start = r.json()
    print(start)

    print("POST /quizzes/{id}/submit")
    answers = {
        "userId": "user-1",
        "attemptId": start["attemptId"],
        "answers": [
            {"questionId": "q1", "selectedOptionIds": ["q1-c"], "timeSpent": 5},
            {"questionId": "q2", "selectedOptionIds": ["q2-c"], "timeSpent": 7},
            {"questionId": "q3", "selectedOptionIds": ["q3-a", "q3-c", "q3-e"], "timeSpent": 12},
            {"questionId": "q4", "selectedOptionIds": ["q4-a"], "timeSpent": 3},
        ],
    }
    r = client.post(f"{base}/quizzes/{qid}/submit", json=answers)
    print(r.status_code)
    res = r.json()
    print(res["attempt"]["score"], res["attempt"]["passed"])
    print("correct map keys:", list(res["correctOptionIdsByQuestion"].keys())[:2])

    print("GET /quizzes/{id}/leaderboard")
    r = client.get(f"{base}/quizzes/{qid}/leaderboard", params={"limit": 5})
    print(r.status_code)
    print(len(r.json()))

    print("GET /quizzes/attempts")
    r = client.get(f"{base}/quizzes/attempts", params={"userId": "user-1"})
    print(r.status_code)
    print(len(r.json()))

