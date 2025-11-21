# IWM Project Folder Structure

**Last Updated:** 2025-10-21  
**Purpose:** Document the clean, professional folder organization of the IWM codebase

---

## 🎯 Design Principles

1. **Separation of Concerns** - Frontend, backend, database, and infrastructure are clearly separated
2. **Scalability** - Structure supports growth from monorepo to microservices
3. **Developer Experience** - Easy to navigate, understand, and maintain
4. **Clean Root** - Minimal files at root level for clarity
5. **Beginner-Friendly** - Clear naming and organization for new developers

---

## 📁 Current Structure (After Reorganization)

```
c:\iwm\v142\
│
├── apps/                          # Application code (monorepo pattern)
│   ├── frontend/                  # Next.js 15 frontend application
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utility functions and API clients
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── styles/                # Global styles and CSS
│   │   ├── public/                # Static assets (images, icons)
│   │   ├── package.json           # Frontend dependencies
│   │   ├── next.config.mjs        # Next.js configuration
│   │   ├── tsconfig.json          # TypeScript configuration
│   │   ├── tailwind.config.ts     # Tailwind CSS configuration
│   │   ├── postcss.config.mjs     # PostCSS configuration
│   │   ├── components.json        # shadcn/ui configuration
│   │   └── playwright.config.ts   # E2E test configuration
│   │
│   └── backend/                   # FastAPI backend application
│       ├── src/                   # Source code
│       │   ├── routers/           # API route handlers
│       │   ├── repositories/      # Data access layer
│       │   ├── services/          # Business logic
│       │   ├── integrations/      # External API integrations
│       │   ├── models.py          # SQLAlchemy models (40+ tables)
│       │   ├── main.py            # FastAPI app initialization
│       │   ├── config.py          # Configuration management
│       │   └── db.py              # Database connection
│       ├── alembic/               # Database migrations
│       ├── requirements.txt       # Python dependencies
│       ├── .env                   # Environment variables
│       └── README.md              # Backend documentation
│
├── database/                      # Database-related files
│   ├── docs/                      # Database documentation
│   │   ├── SCHEMA.md              # Schema documentation (Part 1)
│   │   ├── SCHEMA_PART2.md        # Schema documentation (Part 2)
│   │   ├── ER_DIAGRAM.md          # Entity relationship diagrams
│   │   ├── INDEXES.md             # Index documentation
│   │   ├── EXTENSIONS.md          # PostgreSQL extension guide
│   │   └── PERFORMANCE.md         # Performance optimization guide
│   ├── scripts/                   # Database scripts
│   │   ├── setup_local_postgres.ps1      # Windows setup script
│   │   ├── enable_extensions.sql         # Enable PostgreSQL extensions
│   │   ├── create_indexes.sql            # Create performance indexes
│   │   ├── create_scheduled_jobs.sql     # Set up pg_cron jobs
│   │   └── backup_restore.sh             # Backup/restore utilities
│   ├── README.md                  # Database documentation hub
│   └── INSTALLATION_GUIDE.md      # PostgreSQL installation guide
│
├── packages/                      # Shared packages (monorepo)
│   └── shared/                    # Shared types and utilities
│       ├── openapi.json           # OpenAPI schema (auto-generated)
│       └── types/                 # Shared TypeScript types
│
├── docs/                          # Project documentation
│   ├── CODEBASE_ANALYSIS.md       # Complete codebase analysis
│   ├── KNOWLEDGE_BASE_INSIGHTS.md # PostgreSQL 18 & FastAPI insights
│   ├── FOLDER_STRUCTURE.md        # This file
│   ├── ORM_GUIDE.md               # SQLAlchemy ORM beginner guide
│   ├── SQL_PATTERNS.md            # SQL best practices
│   └── AI_PROMPT_TEMPLATE_MOVIE_DATA.md  # AI enrichment template
│
├── infra/                         # Infrastructure configuration
│   └── docker-compose.yml         # Docker Compose (legacy, not used)
│
├── scripts/                       # Development and utility scripts
│   ├── apps/                      # App-specific scripts
│   ├── setup_backend_venv.ps1     # Backend virtual environment setup
│   ├── setup_backend_venv.sh      # Backend setup (Linux/Mac)
│   ├── enrich_once.py             # Movie data enrichment
│   ├── import_once.py             # Movie data import
│   └── verify_movie_import.py     # Import verification
│
├── tests/                         # Test suites
│   ├── e2e/                       # End-to-end tests (Playwright)
│   ├── contract/                  # API contract tests
│   └── performance/               # Performance tests
│
├── knowlge youube scripts/        # Knowledge base (YouTube transcripts)
│   ├── [Postgres 18 features].txt
│   ├── [PostgreSQL performance].txt
│   ├── [FastAPI best practices].txt
│   └── [Python performance].txt
│
├── .gitignore                     # Git ignore rules
├── README.md                      # Project README
├── package.json                   # Root package.json (workspace config)
├── pnpm-lock.yaml                 # PNPM lock file
├── bun.lock                       # Bun lock file
├── PROJECT_STATUS.md              # Current project status
├── RESTRUCTURING_ACTION_PLAN.md   # Restructuring plan
└── CHANGELOG.md                   # Project changelog
```

---

## 📂 Folder Purposes

### `/apps/frontend/` - Next.js Frontend Application

**Purpose:** All frontend code for the movie review platform  
**Technology:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui  
**Key Features:**
- Server-side rendering (SSR) for SEO
- App Router for modern routing
- Component-based architecture
- Responsive design with Tailwind CSS
- E2E testing with Playwright

**Subdirectories:**
- `app/` - Next.js pages using App Router pattern
- `components/` - Reusable React components organized by feature
- `lib/` - Utility functions, API clients, helper functions
- `hooks/` - Custom React hooks (useDebounce, useMobile, etc.)
- `styles/` - Global CSS and Tailwind styles
- `public/` - Static assets (images, icons, fonts)

---

### `/apps/backend/` - FastAPI Backend Application

**Purpose:** RESTful API server for the movie review platform  
**Technology:** FastAPI, Python 3.12, SQLAlchemy 2.0, AsyncPG, Alembic  
**Key Features:**
- Async/await for high performance
- Repository pattern for data access
- Service layer for business logic
- OpenAPI documentation (auto-generated)
- JWT authentication

**Subdirectories:**
- `src/routers/` - API endpoint handlers (22 routers)
- `src/repositories/` - Data access layer (database queries)
- `src/services/` - Business logic (enrichment, validation)
- `src/integrations/` - External API clients (TMDB, Gemini)
- `alembic/` - Database migration files (20 migrations)

**Key Files:**
- `models.py` - SQLAlchemy models (40+ tables, 972 lines)
- `main.py` - FastAPI app initialization with lifespan
- `config.py` - Pydantic settings for configuration
- `db.py` - Database connection pool management

---

### `/database/` - Database Documentation & Scripts

**Purpose:** Centralized database documentation, scripts, and utilities  
**Technology:** PostgreSQL 18, pg_trgm, pgcrypto, hstore, pg_stat_statements  

**Subdirectories:**
- `docs/` - Comprehensive schema documentation
- `scripts/` - Setup, migration, and maintenance scripts

**Key Features:**
- 40+ table schema documentation
- 100+ performance indexes
- PostgreSQL 18 extension guides
- Automated setup scripts
- Backup/restore utilities

---

### `/packages/shared/` - Shared Code

**Purpose:** Code shared between frontend and backend  
**Contents:**
- OpenAPI schema (auto-generated from backend)
- Shared TypeScript types
- Common utilities

**Why:** Ensures type safety and contract consistency between frontend and backend

---

### `/docs/` - Project Documentation

**Purpose:** High-level project documentation  
**Contents:**
- Codebase analysis
- Architecture decisions
- Best practices guides
- Knowledge base insights
- Developer onboarding

---

### `/infra/` - Infrastructure Configuration

**Purpose:** Infrastructure-as-code and deployment configs  
**Contents:**
- Docker Compose (legacy, not actively used)
- Kubernetes manifests (future)
- CI/CD pipelines (future)

---

### `/scripts/` - Development Scripts

**Purpose:** Utility scripts for development and maintenance  
**Contents:**
- Virtual environment setup
- Data import/export
- Database seeding
- Testing utilities

---

### `/tests/` - Test Suites

**Purpose:** Automated testing  
**Types:**
- E2E tests (Playwright) - User flow testing
- Contract tests - API contract validation
- Performance tests - Load and stress testing

---

## 🔄 Migration from Old Structure

### What Was Moved

**Frontend files moved from root to `apps/frontend/`:**
- `app/` → `apps/frontend/app/`
- `components/` → `apps/frontend/components/`
- `lib/` → `apps/frontend/lib/`
- `hooks/` → `apps/frontend/hooks/`
- `styles/` → `apps/frontend/styles/`
- `public/` → `apps/frontend/public/`
- `next.config.mjs` → `apps/frontend/next.config.mjs`
- `tsconfig.json` → `apps/frontend/tsconfig.json`
- `tailwind.config.ts` → `apps/frontend/tailwind.config.ts`
- `postcss.config.mjs` → `apps/frontend/postcss.config.mjs`
- `components.json` → `apps/frontend/components.json`
- `playwright.config.ts` → `apps/frontend/playwright.config.ts`
- `next-env.d.ts` → `apps/frontend/next-env.d.ts`
- `types.tsx` → `apps/frontend/types.tsx`

**Backend files (already organized):**
- `apps/backend/` - No changes needed

**Database files (newly organized):**
- Created `database/` folder
- Moved database docs and scripts

---

## 🎯 Benefits of New Structure

### 1. **Clear Separation**
- Frontend and backend are clearly separated
- Easy to understand what code belongs where
- Reduces cognitive load for developers

### 2. **Scalability**
- Easy to split into separate repositories if needed
- Can deploy frontend and backend independently
- Supports microservices architecture

### 3. **Developer Experience**
- New developers can quickly understand the structure
- Clear naming conventions
- Comprehensive documentation

### 4. **Maintainability**
- Changes are localized to specific folders
- Easier to find and fix bugs
- Simpler code reviews

### 5. **Build Optimization**
- Frontend and backend can be built independently
- Faster CI/CD pipelines
- Better caching strategies

---

## 📝 Import Path Updates

### Frontend Import Paths (No Changes Needed)

All frontend imports use path aliases defined in `tsconfig.json`:
```typescript
// These paths work from anywhere in the frontend
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce"
```

**Path Aliases:**
- `@/*` → `apps/frontend/*`
- `@/components/*` → `apps/frontend/components/*`
- `@/lib/*` → `apps/frontend/lib/*`
- `@/hooks/*` → `apps/frontend/hooks/*`

### Backend Import Paths (No Changes Needed)

Backend uses relative imports and Python module paths:
```python
# These imports work from anywhere in the backend
from src.models import Movie, User, Review
from src.repositories.movies import MovieRepository
from src.services.enrichment import enrich_movie
```

---

## 🚀 Running the Application

### Frontend (Next.js)
```bash
cd apps/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend (FastAPI)
```bash
cd apps/backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
hypercorn src.main:app --bind 0.0.0.0:8000
# Runs on http://localhost:8000
```

### Database (PostgreSQL 18)
```bash
# Already running on localhost:5433
# Connection: postgresql://postgres:postgres@localhost:5433/iwm
```

---

## 📚 Related Documentation

- [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) - Complete codebase analysis
- [KNOWLEDGE_BASE_INSIGHTS.md](KNOWLEDGE_BASE_INSIGHTS.md) - PostgreSQL 18 & FastAPI insights
- [database/README.md](../database/README.md) - Database documentation
- [apps/backend/README.md](../apps/backend/README.md) - Backend documentation
- [ORM_GUIDE.md](ORM_GUIDE.md) - SQLAlchemy ORM guide (coming soon)
- [SQL_PATTERNS.md](SQL_PATTERNS.md) - SQL best practices (coming soon)

---

**Maintained By:** IWM Development Team  
**Last Restructured:** 2025-10-21  
**Structure Version:** 2.0

