---
type: "always_apply"
---

{
  "metadata": {
    "name": "nextjs_fastapi_mono_to_micro_policy",
    "version": "1.0.0",
    "generated_by": "GPT-5 Mini",
    "description": "Best-practice policy and behavior for Next.js frontend + FastAPI backend in a single monorepo initially, designed to be easily migrated into microservices. Includes feature planning, code-quality, testing, CI/CD, diagnostics and auto-remediation prompt generation."
  },
  "project_structure": {
    "monorepo_root": {
      "folders": [
        "apps/frontend (Next.js)",
        "apps/backend (FastAPI)",
        "packages/shared (shared types, utils, db models)",
        "infra (k8s/helm/docker compose/manifests)",
        "tests (e2e / integration / contract)",
        "docs",
        "scripts (dev, ci, migrate)"
      ],
      "guidelines": [
        "Keep public API contracts (OpenAPI / JSON schemas / TypeScript types) in packages/shared to enable safe split later.",
        "Frontend consumes types from packages/shared (TypeScript) using path aliases or package linking.",
        "Backend exports OpenAPI and JSON schema artifacts to packages/shared during CI.",
        "All services use environment-driven configuration (pydantic BaseSettings for backend, .env for frontend)."
      ]
    },
    "microservice_migration_principles": {
      "decoupling_signals": [
        "Service boundary: single bounded context (e.g., auth, catalog, orders, payments)",
        "Shared package reduces progressively to independent packages per service at migration time",
        "Use API gateways or reverse proxy when splitting",
        "Persist communication through well-defined HTTP APIs or message queues (Kafka/RabbitMQ)"
      ],
      "migration_path": [
        "Phase 0 - Monorepo single deployable: apps/frontend + apps/backend",
        "Phase 1 - Extract pkg: move domain models & DTOs to packages/shared",
        "Phase 2 - Split backend into logical services but run via docker-compose in infra",
        "Phase 3 - Deploy services independently, add API gateway, service discovery",
        "Phase 4 - Scale & tune (autoscaling, separate DBs, per-service logging/monitoring)"
      ]
    }
  },
  "rules": [
    {
      "id": "MS01_monorepo_shared_contracts",
      "name": "Keep API contracts & types in shared package",
      "description": "All DTOs, OpenAPI artifacts, and TypeScript types used across frontend and backend must live in packages/shared to simplify later extraction to microservices.",
      "severity": "error",
      "enforce_on": ["ci", "pre-commit"],
      "auto_fixable": false,
      "remediation_hint": "Export backend OpenAPI artifact to packages/shared during build; generate TypeScript types using openapi-generator or pydantic-to-typescript."
    },
    {
      "id": "MS02_single_db_access_layer",
      "name": "Abstract DB access behind repository layer",
      "description": "Do not sprinkle raw DB calls across endpoints. Use a repository/service layer in backend so data access can be moved per-service later.",
      "severity": "error",
      "enforce_on": ["static-analysis"],
      "auto_fixable": false,
      "remediation_hint": "Create backend/apps/backend/src/repositories and services; endpoints call services not DB client directly."
    },
    {
      "id": "MS03_api_version_and_contract_stability",
      "name": "API versioning & contract tests",
      "description": "Tag public endpoints with versioning (e.g., /api/v1) and run contract tests in CI to catch breaking changes.",
      "severity": "warning",
      "enforce_on": ["ci"],
      "auto_fixable": false,
      "remediation_hint": "Add schema-based contract tests using schemathesis or pytest-openapi."
    },
    {
      "id": "CQ01_types_and_linting",
      "name": "Type safety and linting (FE/BE)",
      "description": "Frontend must use strict TypeScript settings; backend must use mypy / pyright and enforce type coverage threshold.",
      "severity": "error",
      "enforce_on": ["pre-commit", "ci"],
      "auto_fixable": true,
      "auto_fix_strategy": "run --fix stylelint/eslint/ruff/black/isort where safe",
      "remediation_hint": "Set tsconfig.strict true; enable pyproject.toml with ruff/black/isort/mypy"
    },
    {
      "id": "CQ02_code_quality_gate",
      "name": "Code quality gate",
      "description": "Pull requests must pass unit tests, linting, and type checks before merge.",
      "severity": "error",
      "enforce_on": ["ci"],
      "auto_fixable": false,
      "remediation_hint": "Use GitHub Actions / GitLab CI with required checks."
    },
    {
      "id": "DEP01_env_driven_config",
      "name": "Environment-driven configuration & secrets",
      "description": "Do not hardcode environment-specific values or secrets. Use pydantic BaseSettings (backend) and process.env (frontend) along with secret stores for production.",
      "severity": "error",
      "enforce_on": ["static-scan", "ci"],
      "auto_fixable": false,
      "remediation_hint": "Provide settings examples (.env.example) and local .env for dev."
    },
    {
      "id": "TEST01_e2e_user_flow",
      "name": "E2E tests for user-facing flows",
      "description": "Every feature must include E2E test scenarios that simulate how a human accesses the GUI (frontend) and validate backend contract.",
      "severity": "error",
      "enforce_on": ["ci"],
      "auto_fixable": false,
      "remediation_hint": "Use Playwright or Cypress to test flows; run against a staging stack in CI."
    },
    {
      "id": "TEST02_contract_and_integration",
      "name": "Contract & integration tests",
      "description": "Backend APIs must have contract tests and integration tests using test DB or ephemeral containers.",
      "severity": "error",
      "enforce_on": ["ci"],
      "auto_fixable": false,
      "remediation_hint": "Use pytest + testcontainers to run DB in CI; use schemathesis for property testing."
    },
    {
      "id": "ARCH01_separation_for_cpu_heavy",
      "name": "Offload CPU/GPU inference or heavy tasks",
      "description": "Design heavy jobs to be offloaded to worker process/queue or separate inference service. Do not run heavy tasks inline.",
      "severity": "warning",
      "enforce_on": ["static-analysis", "ci"],
      "auto_fixable": false,
      "remediation_hint": "Use Celery/RQ/Kafka and a worker service; containerize model server separately."
    },
    {
      "id": "AUTO01_self_healing_diagnostics",
      "name": "Auto-diagnostics & suggested fixes",
      "description": "When runtime test or CI detects a failure, agent auto-documents the failure, collects minimal logs and stack traces, runs a pattern-based diagnosis, and produces a ranked list of suggested fixes and a ready-to-run remediation prompt. Do not simply fail—attempt remediation suggestions and a patch.",
      "severity": "info",
      "enforce_on": ["ci", "staging"],
      "auto_fixable": true,
      "auto_fix_strategy": "collect logs, run heuristic checks, propose patch or PR with remediation, produce natural-language remediation prompt",
      "remediation_hint": "Integrate with CI to collect failing test logs, run AST/static checks, and generate a draft PR with suggested changes for low-risk fixes (linting, type fixes, small contract changes)."
    },
    {
      "id": "SEC01_production_docs_gate",
      "name": "Disable public docs in production or gate behind auth",
      "description": "Do not expose Swagger/ReDoc in public production deployments unless intentionally public and authenticated.",
      "severity": "warning",
      "enforce_on": ["deployment"],
      "auto_fixable": false,
      "remediation_hint": "Toggle docs_url/openapi_url based on ENV or require gateway auth."
    },
    {
      "id": "CI01_deployable_infra_artifacts",
      "name": "Ship infra artifacts for migration",
      "description": "CI must produce Docker images for frontend and backend and deploy manifest templates (helm or k8s) so migration to separate deploys is simple.",
      "severity": "info",
      "enforce_on": ["ci"],
      "auto_fixable": true,
      "auto_fix_strategy": "build images and push to registry; create templated helm charts in infra/",
      "remediation_hint": "Include per-service Dockerfile even if backend runs as single unit."
    }
  ],
  "feature_planner": {
    "behavior": {
      "when_feature_requested": [
        "Automatically generate up to 30 prioritized feature items for common domains (e.g., ecommerce) if user requests 'generate features'.",
        "For each feature generate: short description, acceptance criteria, frontend tasks, backend tasks, DB schema changes, tests (unit, integration, e2e), infra needs, migration notes (how this feature behaves when split into microservice).",
        "Break each feature into phases: Phase 0 (MVP minimal for monorepo), Phase 1 (scale-ready), Phase 2 (microservice-ready).",
        "Always produce a JSON/markdown roadmap and a ready-to-run prompt template for developer/AI to implement."
      ],
      "quality_constraints": [
        "When producing code, default to high code-quality: type annotations, tests, linted, formatted, with clear docstrings and small functions.",
        "Prefer design patterns that ease splitting: repository/service layers, DTOs, clear boundary interfaces."
      ],
      "autonomy_flags": {
        "auto_implement_low_risk": "If user permits, the agent can auto-create draft PRs for low-risk fixes (lint/type fixes, docs, small refactors).",
        "require_manual_approval": "High-risk changes (DB migration, contract changes, heavy refactor) must require human approval."
      }
    },
    "ecommerce_feature_templates_count": 30,
    "ecommerce_feature_templates": [
      {
        "id": "E01_product_catalog",
        "name": "Product catalog (list, search, filtering)",
        "phase_0": {
          "frontend": ["product list page", "product detail page", "basic search"],
          "backend": ["GET /api/v1/products", "GET /api/v1/products/{id}", "basic text search"],
          "db": ["products table: id, name, slug, price, description, thumbnail"],
          "tests": ["unit tests for search service", "e2e listing flow Playwright"],
          "migration_notes": "Keep service boundary clear: product read APIs can be extracted to catalog service."
        }
      },
      {
        "id": "E02_user_auth",
        "name": "User authentication & sessions",
        "phase_0": {
          "frontend": ["signup, login, logout, profile page"],
          "backend": ["JWT-based auth endpoints", "refresh token flow"],
          "db": ["users table, hashed_password, email_verified"],
          "tests": ["auth unit tests, e2e login flow"],
          "migration_notes": "Auth service must centralize identity; use OpenID Connect if migrating later."
        }
      },
      {
        "id": "E03_shopping_cart",
        "name": "Shopping cart (persisted)",
        "phase_0": {
          "frontend": ["cart UI, quantity updates, mini-cart"],
          "backend": ["cart CRUD endpoints, session/cart merge on login"],
          "db": ["carts, cart_items tables"],
          "tests": ["cart integration tests, e2e add-to-cart flow"],
          "migration_notes": "Cart can become its own microservice and store session data in Redis."
        }
      },
      {
        "id": "E04_checkout_flow",
        "name": "Checkout (orders creation)",
        "phase_0": {
          "frontend": ["checkout steps (shipping, payment)", "order confirmation"],
          "backend": ["POST /orders", order validation, basic tax calc"],
          "db": ["orders, order_items, payments"],
          "tests": ["order creation test, payment mock e2e"],
          "migration_notes": "Orders service boundary ensures consistency; use idempotency keys."
        }
      },
      {
        "id": "E05_payment_integration",
        "name": "Payments (gateway integration)",
        "phase_0": {
          "frontend": ["secure payment UI (tokenization)"],
          "backend": ["server-side payment intent creation, webhook handlers"],
          "db": ["payment_events log"],
          "tests": ["webhook handling simulation"],
          "migration_notes": "Use separate payments service; handle retries and idempotency."
        }
      },
      {
        "id": "E06_inventory_management",
        "name": "Inventory & stock tracking",
        "phase_0": {
          "frontend": ["stock indicators on product page"],
          "backend": ["stock decrement on order, stock query APIs"],
          "db": ["inventory table per SKU"],
          "tests": ["concurrent order stock test"],
          "migration_notes": "Inventory system requires strong consistency or event-driven eventual consistency."
        }
      },
      {
        "id": "E07_promotions_and_coupons",
        "name": "Promotions, discounts, coupon codes",
        "phase_0": {
          "frontend": ["apply coupon input on checkout"],
          "backend": ["validate coupon, apply discount"],
          "db": ["coupons table with usage limits"],
          "tests": ["coupon application scenarios"],
          "migration_notes": "Promotion engine can be service; expose evaluate endpoint for frontend caching."
        }
      },
      {
        "id": "E08_user_profiles_and_addresses",
        "name": "Profiles, shipping addresses",
        "phase_0": {
          "frontend": ["address book UI"],
          "backend": ["address CRUD, default address"],
          "db": ["addresses table linked to users"],
          "tests": ["profile update e2e"],
          "migration_notes": "Profile service for user data helps decouple identity."
        }
      },
      {
        "id": "E09_order_history_and_tracking",
        "name": "Order history, shipment tracking",
        "phase_0": {
          "frontend": ["order list in account", order detail and tracking link"],
          "backend": ["GET orders per user, webhook updates from carrier"],
          "db": ["shipment status fields"],
          "tests": ["status update webhook test"],
          "migration_notes": "Orders/shipping can be split; shipping updates via events."
        }
      },
      {
        "id": "E10_reviews_and_ratings",
        "name": "Product reviews & ratings",
        "phase_0": {
          "frontend": ["write and display reviews", rating aggregation"],
          "backend": ["review CRUD, moderation flag"],
          "db": ["reviews table with index on product_id"],
          "tests": ["reviews moderation scenario"],
          "migration_notes": "Moderation service can offload heavy text analysis."
        }
      },
      {
        "id": "E11_search_and_relevance",
        "name": "Advanced search (facets, relevance, suggestions)",
        "phase_0": {
          "frontend": ["faceted filters, autosuggest"],
          "backend": ["search proxy to Elastic/Algolia"],
          "db": ["search index sync tasks"],
          "tests": ["relevance smoke tests"],
          "migration_notes": "Search often becomes its own service."
        }
      },
      {
        "id": "E12_admin_dashboard",
        "name": "Admin UI for managing products and orders",
        "phase_0": {
          "frontend": ["admin panel pages"],
          "backend": ["admin endpoints with RBAC"],
          "db": ["admin audit logs"],
          "tests": ["admin role access tests"],
          "migration_notes": "Admin UI can be decoupled to avoid coupling with public frontend."
        }
      },
      {
        "id": "E13_notifications",
        "name": "Email/SMS/Push notifications",
        "phase_0": {
          "frontend": ["notification settings page"],
          "backend": ["email task enqueue, webhook handlers"],
          "db": ["notification preferences"],
          "tests": ["email enqueue test"],
          "migration_notes": "Notifications service with retry and backoff."
        }
      },
      {
        "id": "E14_wishlist",
        "name": "User wishlist & favorites",
        "phase_0": {
          "frontend": ["wishlist page and add/remove"],
          "backend": ["wishlist endpoints"],
          "db": ["wishlists table"],
          "tests": ["wishlist persistence test"],
          "migration_notes": "Wishlist lightweight service, good candidate for separate persistence (NoSQL)."
        }
      },
      {
        "id": "E15_multi-currency_and_localization",
        "name": "Localization & currency support",
        "phase_0": {
          "frontend": ["i18n text, currency switcher"],
          "backend": ["pricing API with currency conversion"],
          "db": ["localization strings"],
          "tests": ["localized e2e flows"],
          "migration_notes": "Localization can be externalized; pricing service required for multi-currency."
        }
      },
      {
        "id": "E16_shipping_options",
        "name": "Shipping rates & options",
        "phase_0": {
          "frontend": ["display shipping options at checkout"],
          "backend": ["rate calculation, carrier integration stubs"],
          "db": ["shipping zone rules"],
          "tests": ["rate calculation test"],
          "migration_notes": "Shipping microservice interacts with carriers, webhooks."
        }
      },
      {
        "id": "E17_refunds_and_returns",
        "name": "Returns, refunds workflow",
        "phase_0": {
          "frontend": ["return request UI"],
          "backend": ["return request endpoints, approval workflow"],
          "db": ["returns table"],
          "tests": ["refund process simulation"],
          "migration_notes": "Returns often part of orders service or separate financial service."
        }
      },
      {
        "id": "E18_recommendations",
        "name": "Product recommendations engine",
        "phase_0": {
          "frontend": ["recommended block on product page"],
          "backend": ["recommend API with simple heuristics"],
          "db": ["events log for later ML"],
          "tests": ["recommendation API smoke"],
          "migration_notes": "Move to a dedicated ML inference service as it evolves."
        }
      },
      {
        "id": "E19_analytics_and_metrics",
        "name": "Event tracking & analytics",
        "phase_0": {
          "frontend": ["client-side event tracking"],
          "backend": ["ingest events into analytics pipeline"],
          "db": ["events store"],
          "tests": ["event ingestion integration test"],
          "migration_notes": "Analytics pipeline externalized (big data infra)."
        }
      },
      {
        "id": "E20_customer_support",
        "name": "Support ticketing integration",
        "phase_0": {
          "frontend": ["contact support form"],
          "backend": ["create ticket endpoints, webhook to support tool"],
          "db": ["tickets table"],
          "tests": ["ticket create flow"],
          "migration_notes": "Tickets can be handled by external SaaS or separate support service."
        }
      },
      {
        "id": "E21_affiliate_and_referral",
        "name": "Referral & affiliate management",
        "phase_0": {
          "frontend": ["referral links"],
          "backend": ["track referrals, attribute orders"],
          "db": ["referrals table"],
          "tests": ["referral attribution test"],
          "migration_notes": "Attribution service often separate for scalability."
        }
      },
      {
        "id": "E22_subscriptions",
        "name": "Subscription billing support",
        "phase_0": {
          "frontend": ["subscription signup UI"],
          "backend": ["stripe subscription integration, webhooks"],
          "db": ["subscriptions table"],
          "tests": ["renewal webhook tests"],
          "migration_notes": "Billing service separate; tight integration with payments."
        }
      },
      {
        "id": "E23_seo_and_sitemap",
        "name": "SEO friendly pages and sitemap",
        "phase_0": {
          "frontend": ["server-side rendered product pages", "sitemap generator"],
          "backend": ["metadata APIs"],
          "db": ["seo fields"],
          "tests": ["SEO render smoke tests"],
          "migration_notes": "SSR remains in frontend; prerendering setups may change per service."
        }
      },
      {
        "id": "E24_bulk_import_export",
        "name": "CSV/Excel bulk product import/export",
        "phase_0": {
          "frontend": ["admin import UI"],
          "backend": ["background job for import processing"],
          "db": ["import job table"],
          "tests": ["import validation tests"],
          "migration_notes": "Import service can be a worker on queue."
        }
      },
      {
        "id": "E25_security_and_2fa",
        "name": "Security hardening & 2FA",
        "phase_0": {
          "frontend": ["2FA setup screen"],
          "backend": ["2FA endpoints, rate limiting"],
          "db": ["2fa settings per user"],
          "tests": ["2FA e2e tests"],
          "migration_notes": "Auth service should handle 2FA centrally."
        }
      },
      {
        "id": "E26_rate_limiting_and_throttling",
        "name": "API rate limiting",
        "phase_0": {
          "frontend": ["graceful UI for rate limit errors"],
          "backend": ["rate limiting middleware, redis-based buckets"],
          "db": ["rate limit store in Redis"],
          "tests": ["high QPS test to assert throttling"],
          "migration_notes": "Rate limit is infra-level concern; can be enforced at gateway."
        }
      },
      {
        "id": "E27_audit_and_compliance",
        "name": "Audit logs & compliance",
        "phase_0": {
          "frontend": ["admin audit viewer"],
          "backend": ["write immutable audit events"],
          "db": ["audit_events table or write-ahead storage"],
          "tests": ["audit event generation test"],
          "migration_notes": "Audit service centralizes immutable writes and retention policies."
        }
      },
      {
        "id": "E28_ab_testing_and_feature_flags",
        "name": "A/B testing and feature flags",
        "phase_0": {
          "frontend": ["client-side flag checks"],
          "backend": ["flag evaluation endpoint"],
          "db": ["flag configs"],
          "tests": ["flagging rollout tests"],
          "migration_notes": "Use feature flag service (LaunchDarkly or self-hosted)."
        }
      },
      {
        "id": "E29_customer_reviews_moderation_ai",
        "name": "Automated moderation for reviews",
        "phase_0": {
          "frontend": ["report abuse flow"],
          "backend": ["moderation job queue, basic profanity filter"],
          "db": ["moderation status"],
          "tests": ["moderation pipeline tests"],
          "migration_notes": "Moderation ML pipelines run separately."
        }
      },
      {
        "id": "E30_sla_monitoring_and_alerts",
        "name": "SLA monitoring, logging and alerts",
        "phase_0": {
          "frontend": ["status page stub"],
          "backend": ["instrumentation (Prometheus metrics), structured logs"],
          "db": ["metrics not stored in DB; forward to monitoring stack"],
          "tests": ["synthetic transactions / uptime checks"],
          "migration_notes": "Per-service observability required; ensure uniform metrics across services."
        }
      }
    ]
  },
  "automation": {
    "ci_templates": [
      {
        "name": "ci/monorepo_pipeline",
        "steps": [
          "install dependencies (frontend & backend)",
          "run lint & type checks (eslint/tsc, ruff/mypy)",
          "run unit tests (frontend & backend)",
          "run contract tests (schemathesis or pytest contract)",
          "build Docker images (frontend, backend)",
          "publish OpenAPI artifact to packages/shared",
          "run e2e tests against ephemeral stack (docker-compose or k8s)",
          "on failure: run auto-diagnostics routine and open an annotated issue"
        ]
      }
    ],
    "diagnostic_behavior": {
      "on_test_failure": {
        "collect": ["failing test output", "last 500 lines of service logs", "relevant traces", "stack traces from CI logs"],
        "run": [
          "static-analysis on failing files (AST rules)",
          "pattern-match common issues (missing env var, DB conn refused, schema mismatch)",
          "generate suggested fixes ranked by likelihood",
          "if low-risk: create draft PR with proposed fix (lint, type, small contract mismatch transformation)",
          "if high-risk: open issue with diagnostics and suggested remediation steps and ready-to-run prompt for developer"
        ],
        "deliverables": [
          "diagnostic_report.json (structured findings)",
          "human_readable_summary.md",
          "suggested_patch.diff or draft PR link",
          "implementation_prompt.txt (ready for the AI coding agent to execute)"
        ]
      }
    },
    "prompt_generation": {
      "feature_impl_prompt": "When a feature is requested, produce a developer-ready prompt with: feature description, acceptance criteria, required files to change, endpoints to add, TS types to generate, DB migrations, sample cURL or Playwright test, and scaffolding commands (yarn pnpm/npm commands; poetry/pipenv/poetry for backend).",
      "remediation_prompt": "When an error is diagnosed, produce a focused prompt that includes failing logs, stack trace, minimal reproduction steps, desired behavior and a proposed patch in human friendly steps."
    }
  },
  "observability_and_testing_guidelines": {
    "gui_testing": {
      "tools": ["Playwright", "Cypress"],
      "patterns": [
        "Record e2e flows as human user: login, browse, add-to-cart, checkout",
        "Make tests idempotent and seed test DB per run",
        "Capture screenshots and DOM diffs on failure"
      ]
    },
    "contract_testing": {
      "tools": ["schemathesis", "pytest-openapi"],
      "patterns": [
        "Run contract tests on every PR that touches backend APIs",
        "If contract changes intended, generate migration plan and update packages/shared types first"
      ]
    },
    "metrics_and_alerting": {
      "baselines": [
        "Request latency p95 < configurable threshold",
        "Error rate < configurable threshold",
        "Worker queue length < threshold"
      ],
      "alerts": [
        "High error rate -> auto-diagnostics routine",
        "Long-running request detected -> trace collection + stack sampling"
      ]
    }
  },
  "scaffolds_and_snippets": {
    "lifespan_scaffold_backend": "Provide an async lifespan scaffold that creates db pool and registers resources into app.state; also emits OpenAPI artifact to packages/shared on build.",
    "shared_types_generation": "Provide a script: python generate_types.py -> runs openapi-generator or pydantic2ts to generate TypeScript DTOs under packages/shared",
    "playwright_e2e_template": "Scaffold Playwright tests that exercise user flows and report structured failure artifacts."
  },
  "governance": {
    "approval_rules": [
      "Auto-merge allowed for dependency/formatting/linting fixes if all checks pass.",
      "Major API contract changes require: (a) design doc, (b) migration plan, (c) manual approval by senior dev"
    ],
    "change_management": {
      "api_contract_change": "When a breaking change is introduced, generate a migration plan and a compatibility shim for one release cycle; update packages/shared and frontend consumers first in CI."
    }
  }
}