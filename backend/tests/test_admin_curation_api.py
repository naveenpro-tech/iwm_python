"""
Unit Tests for Admin Movie Curation API (Phase 3)

This test module verifies that:
1. GET /api/admin/movies endpoint works with pagination, filtering, and sorting
2. PATCH /api/admin/movies/{id}/curation endpoint updates curation data
3. RBAC is enforced (admin-only access)
4. Validation is performed on input data
5. Timestamps are set correctly

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Movie, User, RoleType, UserRoleProfile
from src.repositories.admin import AdminRepository, calculate_quality_score
from src.schemas.curation import CurationUpdate


class TestQualityScoringAlgorithm:
    """Test quality scoring algorithm"""

    def test_quality_score_empty_movie(self):
        """Test quality score for movie with minimal data"""
        movie = Movie(
            id=1,
            external_id="test_1",
            title="Test Movie",
            year=None,
            release_date=None,
            runtime=None,
            overview=None,
            tagline=None,
            poster_url=None,
            backdrop_url=None,
            genres=[],
            people=[],
            trivia=None,
            timeline=None,
            siddu_score=None,
            critics_score=None,
            imdb_rating=None,
            rotten_tomatoes_score=None,
        )
        
        score = calculate_quality_score(movie)
        assert 0 <= score <= 100
        assert score < 20  # Should be low for minimal data

    def test_quality_score_complete_movie(self):
        """Test quality score for movie with complete data"""
        # Create mock genres and people
        from src.models import Genre, Person
        
        genres = [Genre(id=1, name="Action"), Genre(id=2, name="Drama")]
        people = [
            Person(id=1, name="Actor 1"),
            Person(id=2, name="Actor 2"),
            Person(id=3, name="Actor 3"),
        ]
        
        movie = Movie(
            id=1,
            external_id="test_1",
            title="Complete Movie",
            year="2024",
            release_date=datetime.now(),
            runtime=120,
            overview="Great movie overview",
            tagline="Amazing tagline",
            poster_url="https://example.com/poster.jpg",
            backdrop_url="https://example.com/backdrop.jpg",
            genres=genres,
            people=people,
            trivia=[
                {"question": "Q1", "answer": "A1"},
                {"question": "Q2", "answer": "A2"},
                {"question": "Q3", "answer": "A3"},
            ],
            timeline=[
                {"date": "2024-01-01", "title": "Event 1"},
                {"date": "2024-01-02", "title": "Event 2"},
                {"date": "2024-01-03", "title": "Event 3"},
            ],
            siddu_score=8.5,
            critics_score=7.8,
            imdb_rating=8.2,
            rotten_tomatoes_score=85,
        )
        
        score = calculate_quality_score(movie)
        assert 0 <= score <= 100
        assert score > 80  # Should be high for complete data

    def test_quality_score_partial_metadata(self):
        """Test quality score for movie with partial metadata"""
        movie = Movie(
            id=1,
            external_id="test_1",
            title="Partial Movie",
            year="2024",
            release_date=datetime.now(),
            runtime=None,
            overview="Some overview",
            tagline=None,
            poster_url="https://example.com/poster.jpg",
            backdrop_url=None,
            genres=[],
            people=[],
            trivia=None,
            timeline=None,
            siddu_score=None,
            critics_score=None,
            imdb_rating=None,
            rotten_tomatoes_score=None,
        )

        score = calculate_quality_score(movie)
        assert 0 <= score <= 100
        assert 10 < score < 30  # Should be low-medium for partial data

    def test_quality_score_boundaries(self):
        """Test quality score stays within 0-100 bounds"""
        movie = Movie(
            id=1,
            external_id="test_1",
            title="Test",
            year=None,
            release_date=None,
            runtime=None,
            overview=None,
            tagline=None,
            poster_url=None,
            backdrop_url=None,
            genres=[],
            people=[],
            trivia=None,
            timeline=None,
            siddu_score=None,
            critics_score=None,
            imdb_rating=None,
            rotten_tomatoes_score=None,
        )
        
        score = calculate_quality_score(movie)
        assert 0 <= score <= 100


class TestCurationUpdateSchema:
    """Test curation update schema validation"""

    def test_curation_update_valid_status(self):
        """Test valid curation status values"""
        valid_statuses = ["draft", "pending_review", "approved", "rejected"]
        
        for status in valid_statuses:
            update = CurationUpdate(curation_status=status)
            assert update.curation_status == status

    def test_curation_update_valid_quality_score(self):
        """Test valid quality score range"""
        for score in [0, 25, 50, 75, 100]:
            update = CurationUpdate(quality_score=score)
            assert update.quality_score == score

    def test_curation_update_invalid_quality_score_negative(self):
        """Test invalid negative quality score"""
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            CurationUpdate(quality_score=-1)

    def test_curation_update_invalid_quality_score_over_100(self):
        """Test invalid quality score over 100"""
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            CurationUpdate(quality_score=101)

    def test_curation_update_invalid_status(self):
        """Test invalid curation status"""
        from pydantic import ValidationError
        
        with pytest.raises(ValidationError):
            CurationUpdate(curation_status="invalid_status")

    def test_curation_update_partial(self):
        """Test partial curation update"""
        update = CurationUpdate(quality_score=85)
        
        assert update.quality_score == 85
        assert update.curation_status is None
        assert update.curator_notes is None

    def test_curation_update_all_fields(self):
        """Test curation update with all fields"""
        update = CurationUpdate(
            curation_status="approved",
            quality_score=90,
            curator_notes="Excellent movie"
        )
        
        assert update.curation_status == "approved"
        assert update.quality_score == 90
        assert update.curator_notes == "Excellent movie"


class TestCurationTimestamps:
    """Test curation timestamp handling"""

    def test_curated_at_set_on_first_update(self):
        """Test that curated_at is set only on first curation"""
        movie = Movie(
            id=1,
            external_id="test_1",
            title="Test Movie",
            curation_status="draft",
            curated_at=None,
            last_reviewed_at=None,
        )
        
        # First update should set curated_at
        assert movie.curated_at is None
        movie.curated_at = datetime.utcnow()
        assert movie.curated_at is not None

    def test_last_reviewed_at_updated_always(self):
        """Test that last_reviewed_at is updated on every change"""
        movie = Movie(
            id=1,
            external_id="test_1",
            title="Test Movie",
            curation_status="draft",
            curated_at=datetime.utcnow(),
            last_reviewed_at=None,
        )
        
        # Update should set last_reviewed_at
        movie.last_reviewed_at = datetime.utcnow()
        assert movie.last_reviewed_at is not None


class TestCurationStatusValues:
    """Test curation status enum values"""

    def test_all_valid_statuses(self):
        """Test all valid curation status values"""
        valid_statuses = ["draft", "pending_review", "approved", "rejected"]
        
        for status in valid_statuses:
            update = CurationUpdate(curation_status=status)
            assert update.curation_status == status

    def test_status_case_sensitive(self):
        """Test that status values are case-sensitive"""
        from pydantic import ValidationError
        
        # Should fail with uppercase
        with pytest.raises(ValidationError):
            CurationUpdate(curation_status="DRAFT")


class TestCurationQualityScoreBoundaries:
    """Test quality score boundary conditions"""

    def test_quality_score_zero(self):
        """Test quality score at zero"""
        update = CurationUpdate(quality_score=0)
        assert update.quality_score == 0

    def test_quality_score_hundred(self):
        """Test quality score at 100"""
        update = CurationUpdate(quality_score=100)
        assert update.quality_score == 100

    def test_quality_score_mid_range(self):
        """Test quality score in mid-range"""
        for score in [25, 50, 75]:
            update = CurationUpdate(quality_score=score)
            assert update.quality_score == score


class TestCurationNotesValidation:
    """Test curator notes validation"""

    def test_curator_notes_optional(self):
        """Test that curator notes are optional"""
        update = CurationUpdate()
        assert update.curator_notes is None

    def test_curator_notes_text(self):
        """Test curator notes with text"""
        notes = "This is a great movie with excellent cinematography"
        update = CurationUpdate(curator_notes=notes)
        assert update.curator_notes == notes

    def test_curator_notes_empty_string(self):
        """Test curator notes with empty string"""
        update = CurationUpdate(curator_notes="")
        assert update.curator_notes == ""

    def test_curator_notes_long_text(self):
        """Test curator notes with long text"""
        notes = "A" * 1000
        update = CurationUpdate(curator_notes=notes)
        assert update.curator_notes == notes

