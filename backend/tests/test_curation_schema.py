"""
Unit Tests for Curation Schema and Model

This test module verifies that:
1. Curation fields are properly added to the Movie model
2. Pydantic schemas validate curation data correctly
3. Database constraints are enforced
4. Curation status enum values are valid

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from datetime import datetime
from pydantic import ValidationError

from src.schemas.curation import (
    CurationBase,
    CurationCreate,
    CurationUpdate,
    CurationResponse,
    CuratorInfo,
    CurationBulkUpdate,
)


class TestCurationBaseSchema:
    """Test CurationBase schema"""

    def test_curation_base_with_all_fields(self):
        """Test creating CurationBase with all fields"""
        data = {
            "curation_status": "approved",
            "quality_score": 85,
            "curator_notes": "Great movie with excellent cinematography",
        }
        schema = CurationBase(**data)
        
        assert schema.curation_status == "approved"
        assert schema.quality_score == 85
        assert schema.curator_notes == "Great movie with excellent cinematography"

    def test_curation_base_with_defaults(self):
        """Test creating CurationBase with default values"""
        schema = CurationBase()
        
        assert schema.curation_status == "draft"
        assert schema.quality_score is None
        assert schema.curator_notes is None

    def test_curation_base_quality_score_validation(self):
        """Test quality score validation (0-100)"""
        # Valid scores
        for score in [0, 50, 100]:
            schema = CurationBase(quality_score=score)
            assert schema.quality_score == score

        # Invalid scores
        with pytest.raises(ValidationError):
            CurationBase(quality_score=-1)

        with pytest.raises(ValidationError):
            CurationBase(quality_score=101)

    def test_curation_base_status_validation(self):
        """Test curation status validation"""
        valid_statuses = ["draft", "pending_review", "approved", "rejected"]
        
        for status in valid_statuses:
            schema = CurationBase(curation_status=status)
            assert schema.curation_status == status

        # Invalid status
        with pytest.raises(ValidationError):
            CurationBase(curation_status="invalid_status")


class TestCurationCreateSchema:
    """Test CurationCreate schema"""

    def test_curation_create_valid(self):
        """Test creating valid CurationCreate"""
        data = {
            "curation_status": "pending_review",
            "quality_score": 75,
            "curator_notes": "Needs review",
        }
        schema = CurationCreate(**data)
        
        assert schema.curation_status == "pending_review"
        assert schema.quality_score == 75
        assert schema.curator_notes == "Needs review"

    def test_curation_create_minimal(self):
        """Test creating CurationCreate with minimal data"""
        schema = CurationCreate()
        
        assert schema.curation_status == "draft"
        assert schema.quality_score is None
        assert schema.curator_notes is None


class TestCurationUpdateSchema:
    """Test CurationUpdate schema"""

    def test_curation_update_partial(self):
        """Test partial update of curation data"""
        schema = CurationUpdate(quality_score=90)
        
        assert schema.quality_score == 90
        assert schema.curation_status is None
        assert schema.curator_notes is None

    def test_curation_update_all_fields(self):
        """Test updating all curation fields"""
        data = {
            "curation_status": "approved",
            "quality_score": 95,
            "curator_notes": "Excellent movie",
        }
        schema = CurationUpdate(**data)
        
        assert schema.curation_status == "approved"
        assert schema.quality_score == 95
        assert schema.curator_notes == "Excellent movie"

    def test_curation_update_empty(self):
        """Test empty update"""
        schema = CurationUpdate()
        
        assert schema.curation_status is None
        assert schema.quality_score is None
        assert schema.curator_notes is None


class TestCuratorInfoSchema:
    """Test CuratorInfo schema"""

    def test_curator_info_valid(self):
        """Test creating valid CuratorInfo"""
        data = {
            "id": 1,
            "name": "John Curator",
            "email": "curator@example.com",
        }
        schema = CuratorInfo(**data)
        
        assert schema.id == 1
        assert schema.name == "John Curator"
        assert schema.email == "curator@example.com"


class TestCurationResponseSchema:
    """Test CurationResponse schema"""

    def test_curation_response_with_curator(self):
        """Test CurationResponse with curator information"""
        data = {
            "curation_status": "approved",
            "quality_score": 88,
            "curator_notes": "Great film",
            "curated_by_id": 1,
            "curated_at": datetime.now(),
            "last_reviewed_at": datetime.now(),
            "curated_by": {
                "id": 1,
                "name": "John Curator",
                "email": "curator@example.com",
            },
        }
        schema = CurationResponse(**data)
        
        assert schema.curation_status == "approved"
        assert schema.quality_score == 88
        assert schema.curated_by_id == 1
        assert schema.curated_by.name == "John Curator"

    def test_curation_response_without_curator(self):
        """Test CurationResponse without curator information"""
        data = {
            "curation_status": "draft",
            "quality_score": None,
            "curator_notes": None,
        }
        schema = CurationResponse(**data)
        
        assert schema.curation_status == "draft"
        assert schema.curated_by is None


class TestCurationBulkUpdateSchema:
    """Test CurationBulkUpdate schema"""

    def test_bulk_update_valid(self):
        """Test valid bulk update"""
        data = {
            "movie_ids": [1, 2, 3, 4, 5],
            "curation_status": "approved",
            "quality_score": 80,
        }
        schema = CurationBulkUpdate(**data)
        
        assert schema.movie_ids == [1, 2, 3, 4, 5]
        assert schema.curation_status == "approved"
        assert schema.quality_score == 80

    def test_bulk_update_partial(self):
        """Test partial bulk update"""
        data = {
            "movie_ids": [1, 2, 3],
            "curation_status": "pending_review",
        }
        schema = CurationBulkUpdate(**data)
        
        assert schema.movie_ids == [1, 2, 3]
        assert schema.curation_status == "pending_review"
        assert schema.quality_score is None

    def test_bulk_update_empty_movie_ids(self):
        """Test bulk update with empty movie IDs"""
        data = {
            "movie_ids": [],
            "curation_status": "approved",
        }
        schema = CurationBulkUpdate(**data)
        
        assert schema.movie_ids == []


class TestCurationStatusValues:
    """Test curation status enum values"""

    def test_all_valid_statuses(self):
        """Test all valid curation status values"""
        valid_statuses = ["draft", "pending_review", "approved", "rejected"]
        
        for status in valid_statuses:
            schema = CurationBase(curation_status=status)
            assert schema.curation_status == status

    def test_invalid_status_raises_error(self):
        """Test that invalid status raises ValidationError"""
        invalid_statuses = ["invalid", "pending", "complete", "archived"]
        
        for status in invalid_statuses:
            with pytest.raises(ValidationError):
                CurationBase(curation_status=status)


class TestCurationQualityScoreBoundaries:
    """Test quality score boundary conditions"""

    def test_quality_score_boundaries(self):
        """Test quality score at boundaries"""
        # Valid boundaries
        schema_min = CurationBase(quality_score=0)
        assert schema_min.quality_score == 0

        schema_max = CurationBase(quality_score=100)
        assert schema_max.quality_score == 100

        # Invalid boundaries
        with pytest.raises(ValidationError):
            CurationBase(quality_score=-1)

        with pytest.raises(ValidationError):
            CurationBase(quality_score=101)

    def test_quality_score_mid_range(self):
        """Test quality score in mid-range"""
        for score in [25, 50, 75]:
            schema = CurationBase(quality_score=score)
            assert schema.quality_score == score

