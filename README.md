# Movie Madders 🎬

**A comprehensive movie review and discovery platform built with Next.js 15 and FastAPI**

> **🚧 BETA VERSION** - Movie Madders is currently in beta. Features and functionality may change.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-yellow)](https://www.python.org/)

---

## 🌟 Features

### Core Features
- **Movie Catalog** - Browse 1000+ movies with detailed information
- **Advanced Search** - Search by title, genre, cast, director, year
- **User Reviews** - Write and read movie reviews with ratings
- **Watchlist & Favorites** - Save movies to watch later or mark as favorites
- **User Collections** - Create custom movie collections

### Industry Features
- **Box Office Tracking** - Real-time box office data and trends
- **Awards Database** - Oscars, Golden Globes, BAFTA, and more
- **Film Festivals** - Cannes, Sundance, Venice, and other festivals

### Content Features
- **Scene Explorer** - Browse and discover memorable movie scenes
- **Visual Treats** - Curated collection of visually stunning scenes
- **Movie Quizzes** - Test your movie knowledge

### Social Features
- **Pulse** - Social feed for movie discussions
- **Talent Hub** - Casting calls and opportunities for aspiring actors

### Admin Features
- **Movie Import** - Bulk import movies from JSON
- **AI Enrichment** - Automatically enrich movie data using Gemini AI
- **Content Moderation** - Manage user-generated content

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** (recommended)
- **Python** 3.12+
- **PostgreSQL** 18 (installed locally on port 5433)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/naveenpro-tech/iwm_python.git
cd iwm_python
```

#### 2. Set Up PostgreSQL 18

PostgreSQL 18 should be installed and running on port 5433.

**Verify PostgreSQL is running:**
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -c "SELECT version();"
```

**Database credentials:**
- Username: `postgres`
- Password: `postgres`
- Database: `iwm`
- Port: `5433`

#### 3. Set Up Backend (FastAPI)

```bash
cd apps/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python -m alembic upgrade head

# Start the backend server
python -m hypercorn src.main:app --bind 0.0.0.0:8000
```

**Backend will be available at:** http://localhost:8000

**API Documentation:** http://localhost:8000/docs (Swagger UI)

#### 4. Set Up Frontend (Next.js)

```bash
# From project root
cd ../..

# Install dependencies (using Bun - recommended)
bun install

# Or using npm
npm install

# Start the development server
bun dev

# Or using npm
npm run dev
```

**Frontend will be available at:** http://localhost:3000

---

## 📁 Project Structure

```
iwm_python/
├── apps/
│   ├── frontend/          # Next.js 15 frontend (currently at root)
│   └── backend/           # FastAPI backend
│       ├── src/
│       │   ├── routers/   # API endpoints
│       │   ├── repositories/  # Data access layer
│       │   ├── services/  # Business logic
│       │   ├── integrations/  # External APIs
│       │   ├── models.py  # SQLAlchemy models (40+ tables)
│       │   ├── main.py    # FastAPI app
│       │   ├── config.py  # Configuration
│       │   └── db.py      # Database connection
│       ├── alembic/       # Database migrations
│       └── requirements.txt
│
├── database/              # Database documentation & scripts
│   ├── docs/              # Schema documentation
│   └── scripts/           # Setup and maintenance scripts
│
├── docs/                  # Project documentation
│   ├── CODEBASE_ANALYSIS.md
│   ├── KNOWLEDGE_BASE_INSIGHTS.md
│   ├── FOLDER_STRUCTURE.md
│   └── ORM_GUIDE.md       # SQLAlchemy beginner guide
│
├── packages/shared/       # Shared types and contracts
│   └── openapi/           # Auto-generated OpenAPI schema
│
├── scripts/               # Development scripts
├── tests/                 # Test suites
└── infra/                 # Infrastructure configs
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.2.4 (App Router)
- **Language:** TypeScript (strict mode)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animations:** Framer Motion
- **Testing:** Playwright (E2E)

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.12
- **ORM:** SQLAlchemy 2.0 (async)
- **Database Driver:** AsyncPG
- **Migrations:** Alembic
- **Server:** Hypercorn (ASGI)
- **Validation:** Pydantic
- **Authentication:** JWT + Argon2
- **Logging:** Structlog

### Database
- **Database:** PostgreSQL 18
- **Extensions:**
  - `pg_trgm` - Fuzzy text search
  - `pgcrypto` - Cryptographic functions
  - `hstore` - Key-value storage
  - `pg_stat_statements` - Query performance tracking

### External APIs
- **TMDB API** - Movie metadata
- **Gemini AI** - Movie data enrichment

---

## 📚 Documentation

### For Beginners
- [ORM Guide](docs/ORM_GUIDE.md) - Comprehensive SQLAlchemy guide for beginners
- [Folder Structure](docs/FOLDER_STRUCTURE.md) - Project organization explained
- [Codebase Analysis](docs/CODEBASE_ANALYSIS.md) - Deep dive into the codebase

### For Advanced Users
- [Knowledge Base Insights](docs/KNOWLEDGE_BASE_INSIGHTS.md) - PostgreSQL 18 & FastAPI best practices
- [Database Schema](database/docs/SCHEMA.md) - Complete database schema documentation
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when backend is running)

---

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
pytest
```

### Frontend E2E Tests
```bash
npx playwright test
```

---

## 🔧 Configuration

### Backend Environment Variables

Create `apps/backend/.env`:

```env
# Environment
ENV=development

# Database (PostgreSQL 18 on port 5433)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5433/moviemadders

# CORS
CORS_ORIGINS=["http://localhost:3000","*"]

# External APIs
TMDB_API_KEY=your_tmdb_api_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# OpenAPI Export
EXPORT_OPENAPI_ON_STARTUP=true
```

### Frontend Environment Variables

Create `.env.local`:

```env
# Base URL for the backend API (used in all environments)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# Enable backend calls (set to true in dev/staging/prod)
NEXT_PUBLIC_ENABLE_BACKEND=true
```

---

## 📖 Common Tasks

### Import Movies

```bash
cd apps/backend
python -m scripts.import_once
```

### Enrich Movie Data with AI

```bash
cd apps/backend
python -m scripts.enrich_once
```

### Create Database Migration

```bash
cd apps/backend
python -m alembic revision --autogenerate -m "description"
```

### Apply Database Migrations

```bash
cd apps/backend
python -m alembic upgrade head
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**IWM Development Team**

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Google Gemini](https://ai.google.dev/) for AI enrichment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [FastAPI](https://fastapi.tiangolo.com/) for the amazing framework
- [Next.js](https://nextjs.org/) for the powerful React framework

---

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ by the Movie Madders Team**

