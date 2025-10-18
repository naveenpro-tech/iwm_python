---
type: "always_apply"
---

{
  "metadata": {
    "name": "fastapi_best_practices_policy",
    "version": "1.0.0",
    "generated_by": "GPT-5 Mini",
    "description": "Enforcement rules to detect and remediate FastAPI anti-patterns from recommended best practices (async rules, DB pools, logging, secrets, background tasks, lifespan)."
  },
  "rules": [
    {
      "id": "A_blocking_in_async",
      "name": "Blocking call inside async endpoint",
      "description": "Detect synchronous/blocking calls used inside async def endpoints which will block the event loop.",
      "severity": "error",
      "detection_signatures": [
        "function.is_async == true AND call.name in ['time.sleep', 'sleep']",
        "function.is_async == true AND call.full_name startswith 'requests.'",
        "function.is_async == true AND call.name == 'open' AND call.mode not contains 'a+'(?)"
      ],
      "auto_fixable": true,
      "auto_fix_strategy": "convert_async_to_sync_or_wrap_with_run_in_threadpool",
      "remediation_snippet": "Option 1 (convert):\nasync def handler(...):\n    time.sleep(5)\n\n=>\ndef handler(...):\n    time.sleep(5)\n\nOption 2 (wrap):\nfrom anyio import to_thread\nasync def handler(...):\n    await to_thread.run_sync(lambda: time.sleep(5))",
      "ci_fail_on": true,
      "suggested_tests": [
        "concurrency_test: send 2 concurrent requests and assert responses overlap (non-serial)",
        "unit_test: lint rule triggers on file with time.sleep inside async def"
      ],
      "examples": {
        "bad": "async def foo():\n    time.sleep(5)\n    return {'ok': True}",
        "fixed": "def foo():\n    time.sleep(5)\n    return {'ok': True}"
      }
    },
    {
      "id": "B_sync_lib_in_async",
      "name": "Synchronous library used in async context",
      "description": "Detect imports/calls to sync-only libraries (requests, pymongo sync usage, urllib) inside modules that define async endpoints.",
      "severity": "warning",
      "detection_signatures": [
        "import requests",
        "from requests import",
        "import pymongo",
        "from pymongo import MongoClient"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "recommend_async_alternatives",
      "remediation_snippet": "Replace synchronous libraries with async equivalents, e.g.:\nrequests -> httpx.AsyncClient\npymongo.MongoClient -> motor.motor_asyncio.AsyncIOMotorClient",
      "ci_fail_on": false,
      "suggested_tests": [
        "static_import_check: module that defines async endpoints should not import 'requests' or 'pymongo' without clear sync-only usage"
      ],
      "examples": {
        "bad": "import requests\nasync def get_data():\n    r = requests.get('https://api')\n    return r.json()",
        "fixed": "import httpx\nasync def get_data():\n    async with httpx.AsyncClient() as c:\n        r = await c.get('https://api')\n    return r.json()"
      }
    },
    {
      "id": "C_per_request_db_connection",
      "name": "Creating DB connection per request",
      "description": "Detect code that constructs a new DB connection inside request handlers instead of using a pool/lifespan-managed resource.",
      "severity": "error",
      "detection_signatures": [
        "call.name in ['connect', 'MongoClient', 'create_engine'] AND call is inside function AND not in startup/lifespan context",
        "pattern: inside endpoint -> new DB connection construction"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "provide_lifespan_scaffold_snippet",
      "remediation_snippet": "Use a connection pool created in app startup (lifespan) and inject via dependency:\n\nfrom fastapi import FastAPI\n\nasync def lifespan(app):\n    app.state.db_pool = await create_pool(...)\n    yield\n    await app.state.db_pool.close()\n\napp = FastAPI(lifespan=lifespan)\n\nasync def get_db():\n    return app.state.db_pool",
      "ci_fail_on": true,
      "suggested_tests": [
        "integration_test: assert app starts and single pool object reused across requests",
        "static_check: creation of DB client inside function triggers rule"
      ],
      "examples": {
        "bad": "async def handler():\n    db = await create_conn()\n    await db.query(...)",
        "fixed": "app.state.pool = await create_pool(...)\nasync def handler():\n    db = app.state.pool\n    await db.query(...)"
      }
    },
    {
      "id": "D_heavy_compute_inline",
      "name": "Heavy CPU/GPU computation in endpoint",
      "description": "Detect likely heavy compute (torch, tensorflow, cv2, PIL image processing) inside endpoints and recommend offloading to workers or dedicated inference servers.",
      "severity": "warning",
      "detection_signatures": [
        "import torch",
        "import tensorflow",
        "import cv2",
        "from PIL import Image",
        "large loops performing math inside endpoint"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "recommend_queue_worker_or_inference_server",
      "remediation_snippet": "Offload to worker queue (Celery example):\n\n# tasks.py\nfrom celery import Celery\napp = Celery(...)\n@app.task\ndef run_inference(data):\n    return model.predict(data)\n\n# endpoint\nfrom tasks import run_inference\ndef handler(data):\n    run_inference.delay(data)\n    return {'accepted': True}",
      "ci_fail_on": false,
      "suggested_tests": [
        "static_import_check: flag endpoints importing heavy ML libs",
        "load_test: assert endpoint CPU usage spikes if heavy compute is inline"
      ],
      "examples": {
        "bad": "def predict(image):\n    result = model(image)  # heavy\n    return result",
        "fixed": "def predict_request(image):\n    task_id = run_inference.delay(image)\n    return {'task_id': task_id}"
      }
    },
    {
      "id": "E_background_task_durability",
      "name": "BackgroundTasks used for durable work",
      "description": "Detect use of BackgroundTasks for work that needs durability (retries, persistence). Recommend queue+worker for guaranteed processing.",
      "severity": "warning",
      "detection_signatures": [
        "from fastapi import BackgroundTasks AND bg_tasks.add_task(...)",
        "await send_email() used directly in endpoint for non-critical path"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "recommend_queue_with_retry",
      "remediation_snippet": "Use a queue for durable work (example RQ/Celery):\n\n# endpoint\nfrom tasks import send_email_task\ndef register(user):\n    send_email_task.delay(user.email)\n    return {'status': 'queued'}",
      "ci_fail_on": false,
      "suggested_tests": [
        "static_check: flag use of BackgroundTasks when operation annotated as 'durable' in code comments",
        "runtime_test: simulate worker crash and assert durable task persisted"
      ],
      "examples": {
        "bad": "async def register(user, bg: BackgroundTasks):\n    bg.add_task(send_email, user.email)\n    return {'ok': True}",
        "fixed": "def register(user):\n    send_email_task.delay(user.email)\n    return {'ok': True}"
      }
    },
    {
      "id": "F_secrets_hardcoded",
      "name": "Hard-coded secrets in code",
      "description": "Detect likely credentials, API keys, and secrets stored directly in source files.",
      "severity": "error",
      "detection_signatures": [
        "regex: ['API_KEY\\s*=\\s*\"[A-Za-z0-9_-]{8,}\"', 'PASSWORD\\s*=\\s*\".+\"', 'SECRET\\s*=']",
        "literal strings matching AWS/Stripe/GCP token patterns"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "recommend_env_settings",
      "remediation_snippet": "Use pydantic BaseSettings or environment variables:\n\nfrom pydantic import BaseSettings\nclass Settings(BaseSettings):\n    db_url: str\n    class Config:\n        env_file = '.env'\n\nsettings = Settings()",
      "ci_fail_on": true,
      "suggested_tests": [
        "git_history_scan: search repo history for secret patterns",
        "static_scan: fail PR if new hard-coded secret introduced"
      ],
      "examples": {
        "bad": "DB_PASSWORD = \"hunter2\"\nclient.connect(DB_PASSWORD)",
        "fixed": "from settings import settings\nclient.connect(settings.db_url)"
      }
    },
    {
      "id": "G_print_logging",
      "name": "Use structured logging instead of print",
      "description": "Detect usage of print() for logging. Recommend structured logging (logging, Loguru, structlog) and request-id middleware.",
      "severity": "warning",
      "detection_signatures": [
        "call.name == 'print'",
        "logger = None OR no logging configuration found"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "provide_logger_boilerplate",
      "remediation_snippet": "Example with structlog:\n\nimport structlog\nstructlog.configure(processors=[structlog.processors.JSONRenderer()])\nlog = structlog.get_logger()\n\nlog.info('request_received', path=path, request_id=req_id)",
      "ci_fail_on": false,
      "suggested_tests": [
        "static_check: fail if print() used in production files",
        "integration: ensure logs emitted in structured JSON format"
      ],
      "examples": {
        "bad": "print('user created', user.id)",
        "fixed": "log.info('user.created', user_id=user.id)"
      }
    },
    {
      "id": "H_docs_exposed_in_prod",
      "name": "Swagger/ReDoc exposed in production",
      "description": "Detect app instantiation exposing docs_url/redoc_url/openapi_url in prod environment. Recommend disabling or gating behind auth in production.",
      "severity": "info",
      "detection_signatures": [
        "FastAPI(..., docs_url=None) missing when ENV == 'production' check absent",
        "explicit docs_url set to default in production config"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "advise_disable_docs_in_prod",
      "remediation_snippet": "Disable docs in production:\n\nimport os\nis_prod = os.getenv('ENV') == 'production'\napp = FastAPI(docs_url=None if is_prod else '/docs', redoc_url=None if is_prod else '/redoc')",
      "ci_fail_on": false,
      "suggested_tests": [
        "static_check: ensure app config disables docs when ENV=production",
        "smoke_test: try to access /docs in staging/prod and ensure blocked"
      ],
      "examples": {
        "bad": "app = FastAPI()  # no ENV-based docs control",
        "fixed": "app = FastAPI(docs_url=None if os.getenv('ENV')=='production' else '/docs')"
      }
    },
    {
      "id": "I_lifespan_missing",
      "name": "Lifespan not used for app-level resources",
      "description": "Detect missing lifespan/startup management for app-level resources and recommend using FastAPI lifespan context manager.",
      "severity": "warning",
      "detection_signatures": [
        "use of @app.on_event('startup') and @app.on_event('shutdown') instead of lifespan context OR no startup resource creation found",
        "app.state.* resources missing while connection creation scattered"
      ],
      "auto_fixable": false,
      "auto_fix_strategy": "provide_lifespan_template",
      "remediation_snippet": "Use lifespan context manager:\n\nfrom contextlib import asynccontextmanager\n@asynccontextmanager\nasync def lifespan(app):\n    app.state.cache = await create_cache()\n    yield\n    await app.state.cache.close()\n\napp = FastAPI(lifespan=lifespan)",
      "ci_fail_on": false,
      "suggested_tests": [
        "integration_test: ensure lifespan yields and resources closed on shutdown",
        "static_check: flag missing centralized resource creation"
      ],
      "examples": {
        "bad": "conn = None\n@app.on_event('startup')\ndef startup():\n    global conn\n    conn = connect_db()\n\n@app.on_event('shutdown')\ndef shutdown():\n    conn.close()",
        "fixed": "async def lifespan(app):\n    app.state.conn = await create_pool()\n    yield\n    await app.state.conn.close()\n\napp = FastAPI(lifespan=lifespan)"
      }
    }
  ]
}