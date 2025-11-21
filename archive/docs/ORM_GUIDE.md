# SQLAlchemy ORM Guide for Beginners

**Last Updated:** 2025-10-21  
**Purpose:** Comprehensive guide to using SQLAlchemy ORM in the IWM project  
**Audience:** Beginners with basic Python knowledge

---

## 📚 Table of Contents

1. [What is an ORM?](#what-is-an-orm)
2. [Why SQLAlchemy?](#why-sqlalchemy)
3. [Basic Concepts](#basic-concepts)
4. [Models (Database Tables)](#models-database-tables)
5. [Querying Data](#querying-data)
6. [Creating Data](#creating-data)
7. [Updating Data](#updating-data)
8. [Deleting Data](#deleting-data)
9. [Relationships](#relationships)
10. [Async/Await Patterns](#asyncawait-patterns)
11. [Repository Pattern](#repository-pattern)
12. [Common Pitfalls](#common-pitfalls)

---

## 🤔 What is an ORM?

**ORM** stands for **Object-Relational Mapping**.

### The Problem
- Databases store data in **tables** (rows and columns)
- Python works with **objects** (classes and instances)
- Writing SQL queries manually is tedious and error-prone

### The Solution
An ORM bridges the gap by:
- Representing database tables as Python classes
- Representing rows as Python objects
- Automatically converting between Python and SQL

### Example

**Without ORM (Raw SQL):**
```python
# Hard to read, easy to make mistakes, SQL injection risks
cursor.execute("SELECT * FROM movies WHERE id = %s", (movie_id,))
row = cursor.fetchone()
movie_title = row[1]  # What is index 1? Hard to remember!
```

**With ORM (SQLAlchemy):**
```python
# Clear, type-safe, no SQL injection
movie = await session.get(Movie, movie_id)
movie_title = movie.title  # Clear and readable!
```

---

## 🚀 Why SQLAlchemy?

SQLAlchemy is the most popular Python ORM because:

1. **Powerful** - Supports complex queries and relationships
2. **Flexible** - Can use ORM or raw SQL when needed
3. **Async Support** - Works with async/await for better performance
4. **Type Safe** - Works well with type hints and IDEs
5. **Battle-Tested** - Used by thousands of production applications

**Version:** We use SQLAlchemy 2.0 (latest, with async support)

---

## 🧩 Basic Concepts

### 1. **Model** (Database Table)
A Python class that represents a database table.

```python
class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(500), nullable=False)
    release_year = Column(Integer)
```

### 2. **Session** (Database Connection)
A session manages database operations (queries, inserts, updates, deletes).

```python
async with AsyncSession(engine) as session:
    # All database operations happen here
    movie = await session.get(Movie, 1)
```

### 3. **Query** (Fetching Data)
How you retrieve data from the database.

```python
# Get all movies
result = await session.execute(select(Movie))
movies = result.scalars().all()
```

### 4. **Commit** (Saving Changes)
Changes aren't saved until you commit.

```python
session.add(new_movie)
await session.commit()  # Now it's saved to database
```

---

## 📊 Models (Database Tables)

### Defining a Model

**Location:** `apps/backend/src/models.py`

```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import declarative_base
from datetime import datetime

# Base class for all models
Base = declarative_base()

class Movie(Base):
    """
    Represents a movie in the database.
    
    Each instance of this class is one row in the 'movies' table.
    """
    __tablename__ = "movies"  # Name of the table in PostgreSQL
    
    # Primary Key - Unique identifier for each movie
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Movie details
    title = Column(String(500), nullable=False)  # Required field
    original_title = Column(String(500))  # Optional field
    release_year = Column(Integer)
    runtime_minutes = Column(Integer)
    
    # Ratings
    imdb_rating = Column(Float)
    tmdb_rating = Column(Float)
    
    # Descriptions
    plot_summary = Column(Text)  # Text = unlimited length
    tagline = Column(String(500))
    
    # Timestamps - Automatically track when records are created/updated
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Column Types

| SQLAlchemy Type | PostgreSQL Type | Python Type | Use Case |
|----------------|-----------------|-------------|----------|
| `Integer` | `INTEGER` | `int` | Numbers (IDs, years, counts) |
| `String(n)` | `VARCHAR(n)` | `str` | Short text (titles, names) |
| `Text` | `TEXT` | `str` | Long text (descriptions, reviews) |
| `Float` | `REAL` | `float` | Decimal numbers (ratings, prices) |
| `Boolean` | `BOOLEAN` | `bool` | True/False values |
| `DateTime` | `TIMESTAMP` | `datetime` | Dates and times |
| `JSON` | `JSON` | `dict/list` | Structured data |
| `JSONB` | `JSONB` | `dict/list` | Structured data (faster, PostgreSQL-specific) |

### Column Options

```python
# Required field (cannot be NULL)
title = Column(String(500), nullable=False)

# Optional field (can be NULL)
tagline = Column(String(500), nullable=True)  # or just nullable=True

# Unique constraint (no duplicates allowed)
email = Column(String(255), unique=True)

# Default value
is_active = Column(Boolean, default=True)

# Auto-increment primary key
id = Column(Integer, primary_key=True, autoincrement=True)

# Index for faster queries
title = Column(String(500), index=True)
```

---

## 🔍 Querying Data

### Get One Record by ID

```python
from sqlalchemy import select
from src.models import Movie

async def get_movie_by_id(session, movie_id: int):
    """
    Fetch a single movie by its ID.
    
    Returns None if not found.
    """
    # Method 1: Using session.get() - Simplest for primary key lookups
    movie = await session.get(Movie, movie_id)
    return movie
    
    # Method 2: Using select() - More flexible
    stmt = select(Movie).where(Movie.id == movie_id)
    result = await session.execute(stmt)
    movie = result.scalar_one_or_none()  # Returns None if not found
    return movie
```

### Get All Records

```python
async def get_all_movies(session):
    """
    Fetch all movies from the database.
    
    Warning: This can be slow if you have many movies!
    Consider using pagination instead.
    """
    stmt = select(Movie)
    result = await session.execute(stmt)
    movies = result.scalars().all()  # Returns a list of Movie objects
    return movies
```

### Filter Records (WHERE clause)

```python
async def get_movies_by_year(session, year: int):
    """
    Get all movies released in a specific year.
    """
    stmt = select(Movie).where(Movie.release_year == year)
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies

async def get_highly_rated_movies(session, min_rating: float = 8.0):
    """
    Get movies with IMDB rating >= min_rating.
    """
    stmt = select(Movie).where(Movie.imdb_rating >= min_rating)
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies
```

### Multiple Filters (AND)

```python
async def get_recent_highly_rated_movies(session):
    """
    Get movies from 2020 onwards with rating >= 8.0.
    """
    stmt = select(Movie).where(
        Movie.release_year >= 2020,
        Movie.imdb_rating >= 8.0
    )
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies
```

### OR Filters

```python
from sqlalchemy import or_

async def get_movies_by_title_or_original_title(session, search: str):
    """
    Search for movies by title OR original title.
    """
    stmt = select(Movie).where(
        or_(
            Movie.title.ilike(f"%{search}%"),  # Case-insensitive LIKE
            Movie.original_title.ilike(f"%{search}%")
        )
    )
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies
```

### Ordering Results

```python
async def get_movies_sorted_by_rating(session):
    """
    Get all movies sorted by IMDB rating (highest first).
    """
    stmt = select(Movie).order_by(Movie.imdb_rating.desc())
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies

async def get_movies_sorted_by_year_and_title(session):
    """
    Sort by year (newest first), then by title (A-Z).
    """
    stmt = select(Movie).order_by(
        Movie.release_year.desc(),
        Movie.title.asc()
    )
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies
```

### Pagination (LIMIT and OFFSET)

```python
async def get_movies_paginated(session, page: int = 1, page_size: int = 20):
    """
    Get movies with pagination.
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of movies per page
    
    Returns:
        List of movies for the requested page
    """
    offset = (page - 1) * page_size
    
    stmt = select(Movie).offset(offset).limit(page_size)
    result = await session.execute(stmt)
    movies = result.scalars().all()
    return movies
```

### Count Records

```python
from sqlalchemy import func

async def count_movies(session):
    """
    Count total number of movies in database.
    """
    stmt = select(func.count()).select_from(Movie)
    result = await session.execute(stmt)
    count = result.scalar()
    return count

async def count_movies_by_year(session, year: int):
    """
    Count movies released in a specific year.
    """
    stmt = select(func.count()).select_from(Movie).where(Movie.release_year == year)
    result = await session.execute(stmt)
    count = result.scalar()
    return count
```

---

## ➕ Creating Data

### Create a Single Record

```python
async def create_movie(session, title: str, release_year: int):
    """
    Create a new movie in the database.
    """
    # Step 1: Create a new Movie object
    new_movie = Movie(
        title=title,
        release_year=release_year,
        # created_at and updated_at are set automatically
    )
    
    # Step 2: Add it to the session
    session.add(new_movie)
    
    # Step 3: Commit to save to database
    await session.commit()
    
    # Step 4: Refresh to get the auto-generated ID
    await session.refresh(new_movie)
    
    return new_movie
```

### Create Multiple Records (Bulk Insert)

```python
async def create_multiple_movies(session, movies_data: list[dict]):
    """
    Create multiple movies at once (more efficient).
    """
    # Create Movie objects from dictionaries
    movies = [Movie(**data) for data in movies_data]
    
    # Add all at once
    session.add_all(movies)
    
    # Commit once (faster than committing each individually)
    await session.commit()
    
    return movies
```

---

## 🔄 Updating Data

### Update a Single Record

```python
async def update_movie_rating(session, movie_id: int, new_rating: float):
    """
    Update a movie's IMDB rating.
    """
    # Step 1: Fetch the movie
    movie = await session.get(Movie, movie_id)
    
    if not movie:
        return None
    
    # Step 2: Modify the object
    movie.imdb_rating = new_rating
    # updated_at is automatically updated
    
    # Step 3: Commit the changes
    await session.commit()
    
    return movie
```

### Update Multiple Fields

```python
async def update_movie(session, movie_id: int, **updates):
    """
    Update multiple fields of a movie.
    
    Example:
        await update_movie(session, 1, title="New Title", runtime_minutes=120)
    """
    movie = await session.get(Movie, movie_id)
    
    if not movie:
        return None
    
    # Update all provided fields
    for key, value in updates.items():
        setattr(movie, key, value)
    
    await session.commit()
    await session.refresh(movie)
    
    return movie
```

---

## 🗑️ Deleting Data

### Delete a Single Record

```python
async def delete_movie(session, movie_id: int):
    """
    Delete a movie from the database.
    """
    movie = await session.get(Movie, movie_id)
    
    if not movie:
        return False
    
    await session.delete(movie)
    await session.commit()
    
    return True
```

---

## 🔗 Relationships

### One-to-Many Relationship

**Example:** One movie has many reviews.

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(500))
    
    # Relationship: One movie has many reviews
    reviews = relationship("Review", back_populates="movie")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))  # Foreign key
    rating = Column(Integer)
    comment = Column(Text)
    
    # Relationship: Each review belongs to one movie
    movie = relationship("Movie", back_populates="reviews")
```

**Usage:**
```python
# Get a movie and all its reviews
movie = await session.get(Movie, 1)
reviews = movie.reviews  # List of Review objects

# Get a review and its movie
review = await session.get(Review, 1)
movie_title = review.movie.title
```

---

## ⚡ Async/Await Patterns

### Why Async?

**Synchronous (Blocking):**
```python
# Request 1 arrives
movie = get_movie(1)  # Wait 100ms for database
# Request 2 must wait until Request 1 finishes
# Request 3 must wait until Request 2 finishes
# Total time for 3 requests: 300ms
```

**Asynchronous (Non-Blocking):**
```python
# Request 1 arrives
movie = await get_movie(1)  # Start database query, don't wait
# Request 2 arrives while Request 1 is waiting
# Request 3 arrives while Requests 1 and 2 are waiting
# All 3 requests complete in ~100ms (concurrent)
```

### Async Session Pattern

```python
from sqlalchemy.ext.asyncio import AsyncSession
from src.db import get_session

async def my_endpoint():
    """
    Proper way to use async sessions.
    """
    # Get a session from the connection pool
    async with get_session() as session:
        # All database operations here
        movie = await session.get(Movie, 1)

        # Session is automatically closed when exiting the 'with' block
        return movie
```

### Common Async Mistakes

**❌ WRONG - Forgetting await:**
```python
movie = session.get(Movie, 1)  # Returns a coroutine, not a Movie!
print(movie.title)  # ERROR: coroutine has no attribute 'title'
```

**✅ CORRECT:**
```python
movie = await session.get(Movie, 1)  # Actually executes the query
print(movie.title)  # Works!
```

**❌ WRONG - Using sync libraries in async code:**
```python
import requests  # Synchronous library

async def fetch_data():
    response = requests.get("https://api.example.com")  # Blocks event loop!
```

**✅ CORRECT:**
```python
import httpx  # Async library

async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")  # Non-blocking!
```

---

## 🏗️ Repository Pattern

The repository pattern separates database logic from business logic.

### Why Use Repository Pattern?

1. **Separation of Concerns** - Database code is separate from API code
2. **Reusability** - Same query can be used in multiple endpoints
3. **Testability** - Easy to mock repositories for testing
4. **Maintainability** - Changes to queries are centralized

### Example Repository

**Location:** `apps/backend/src/repositories/movies.py`

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Movie

class MovieRepository:
    """
    Handles all database operations for movies.

    This class encapsulates all movie-related queries,
    making them reusable across different parts of the application.
    """

    def __init__(self, session: AsyncSession):
        """
        Initialize the repository with a database session.

        Args:
            session: SQLAlchemy async session
        """
        self.session = session

    async def get_by_id(self, movie_id: int) -> Movie | None:
        """
        Get a movie by its ID.

        Args:
            movie_id: The movie's unique identifier

        Returns:
            Movie object if found, None otherwise
        """
        return await self.session.get(Movie, movie_id)

    async def get_all(self, limit: int = 100, offset: int = 0) -> list[Movie]:
        """
        Get all movies with pagination.

        Args:
            limit: Maximum number of movies to return
            offset: Number of movies to skip

        Returns:
            List of Movie objects
        """
        stmt = select(Movie).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def search_by_title(self, query: str) -> list[Movie]:
        """
        Search movies by title (case-insensitive).

        Args:
            query: Search term

        Returns:
            List of matching Movie objects
        """
        stmt = select(Movie).where(Movie.title.ilike(f"%{query}%"))
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create(self, **movie_data) -> Movie:
        """
        Create a new movie.

        Args:
            **movie_data: Movie fields as keyword arguments

        Returns:
            The created Movie object
        """
        movie = Movie(**movie_data)
        self.session.add(movie)
        await self.session.commit()
        await self.session.refresh(movie)
        return movie

    async def update(self, movie_id: int, **updates) -> Movie | None:
        """
        Update a movie's fields.

        Args:
            movie_id: The movie's ID
            **updates: Fields to update

        Returns:
            Updated Movie object if found, None otherwise
        """
        movie = await self.get_by_id(movie_id)
        if not movie:
            return None

        for key, value in updates.items():
            setattr(movie, key, value)

        await self.session.commit()
        await self.session.refresh(movie)
        return movie

    async def delete(self, movie_id: int) -> bool:
        """
        Delete a movie.

        Args:
            movie_id: The movie's ID

        Returns:
            True if deleted, False if not found
        """
        movie = await self.get_by_id(movie_id)
        if not movie:
            return False

        await self.session.delete(movie)
        await self.session.commit()
        return True
```

### Using the Repository in an Endpoint

**Location:** `apps/backend/src/routers/movies.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db import get_session
from src.repositories.movies import MovieRepository

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/{movie_id}")
async def get_movie(
    movie_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Get a movie by ID.

    This endpoint uses the repository pattern to fetch data.
    """
    # Create repository instance
    repo = MovieRepository(session)

    # Use repository method
    movie = await repo.get_by_id(movie_id)

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return movie
```

---

## ⚠️ Common Pitfalls

### 1. Forgetting to Commit

**❌ WRONG:**
```python
movie = Movie(title="Inception")
session.add(movie)
# Forgot to commit! Changes are not saved.
```

**✅ CORRECT:**
```python
movie = Movie(title="Inception")
session.add(movie)
await session.commit()  # Now it's saved!
```

### 2. Not Refreshing After Commit

**❌ WRONG:**
```python
movie = Movie(title="Inception")
session.add(movie)
await session.commit()
print(movie.id)  # None! ID is not loaded yet.
```

**✅ CORRECT:**
```python
movie = Movie(title="Inception")
session.add(movie)
await session.commit()
await session.refresh(movie)  # Load the auto-generated ID
print(movie.id)  # Now it works!
```

### 3. N+1 Query Problem

**❌ WRONG (Slow):**
```python
# Get all movies
movies = await session.execute(select(Movie))
movies = movies.scalars().all()

# For each movie, get its reviews (separate query each time!)
for movie in movies:
    reviews = await session.execute(
        select(Review).where(Review.movie_id == movie.id)
    )
    # This creates N+1 queries (1 for movies + N for reviews)
```

**✅ CORRECT (Fast):**
```python
from sqlalchemy.orm import selectinload

# Load movies with their reviews in one query
stmt = select(Movie).options(selectinload(Movie.reviews))
result = await session.execute(stmt)
movies = result.scalars().all()

# Now reviews are already loaded (no extra queries)
for movie in movies:
    reviews = movie.reviews  # Already loaded!
```

### 4. Modifying Objects Outside Session

**❌ WRONG:**
```python
async with get_session() as session:
    movie = await session.get(Movie, 1)
# Session is closed here

movie.title = "New Title"  # This won't be saved!
```

**✅ CORRECT:**
```python
async with get_session() as session:
    movie = await session.get(Movie, 1)
    movie.title = "New Title"  # Modify inside session
    await session.commit()  # Save before session closes
```

### 5. Using Blocking Code in Async Functions

**❌ WRONG:**
```python
import time

async def slow_function():
    time.sleep(5)  # Blocks the entire event loop!
    # All other requests are frozen for 5 seconds
```

**✅ CORRECT:**
```python
import asyncio

async def fast_function():
    await asyncio.sleep(5)  # Non-blocking sleep
    # Other requests can be processed during this time
```

---

## 📚 Additional Resources

### Official Documentation
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [FastAPI Database Guide](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [AsyncPG Documentation](https://magicstack.github.io/asyncpg/)

### IWM Project Files
- `apps/backend/src/models.py` - All database models
- `apps/backend/src/db.py` - Database connection setup
- `apps/backend/src/repositories/` - Repository implementations
- `database/docs/SCHEMA.md` - Database schema documentation

### Next Steps
1. Read `SQL_PATTERNS.md` for SQL best practices
2. Explore `apps/backend/src/repositories/` for real examples
3. Try modifying a repository and testing it
4. Read the FastAPI documentation for more advanced patterns

---

**Maintained By:** IWM Development Team
**Last Updated:** 2025-10-21
**Questions?** Check the official SQLAlchemy docs or ask the team!

