"""
Tests for admin bulk operations (Phase 5)

This module tests bulk update, bulk publish, and bulk feature operations
for movie curation.

Author: IWM Development Team
Date: 2025-10-30
"""

import pytest
from fastapi import status
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add src directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.security.jwt import create_access_token


class TestBulkUpdateMovies:
    """Test bulk update endpoint"""

    def test_bulk_update_unauthorized(self, client: TestClient):
        """Test bulk update without auth"""
        response = client.post(
            "/api/v1/admin/movies/bulk-update",
            json={
                "movie_ids": [1],
                "curation_data": {
                    "curation_status": "approved",
                },
            },
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED



class TestBulkPublishMovies:
    """Test bulk publish endpoint"""

    def test_bulk_publish_unauthorized(self, client: TestClient):
        """Test bulk publish without auth"""
        response = client.post(
            "/api/v1/admin/movies/bulk-publish",
            json={
                "movie_ids": [1],
                "publish": True,
            },
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestBulkFeatureMovies:
    """Test bulk feature endpoint"""

    def test_bulk_feature_unauthorized(self, client: TestClient):
        """Test bulk feature without auth"""
        response = client.post(
            "/api/v1/admin/movies/bulk-feature",
            json={
                "movie_ids": [1],
                "featured": True,
            },
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

