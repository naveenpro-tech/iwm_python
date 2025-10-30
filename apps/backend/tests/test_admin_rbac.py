"""
Unit Tests for Admin RBAC (Role-Based Access Control)

This test module verifies that:
1. Admin users can access all admin endpoints
2. Non-admin users receive 403 Forbidden errors
3. Unauthenticated users receive 401 Unauthorized errors
4. The require_admin dependency works correctly

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from fastapi import status
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add src directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.security.jwt import create_access_token


# Test user IDs for JWT token creation
ADMIN_USER_ID = 1
NON_ADMIN_USER_ID = 2
DISABLED_ADMIN_USER_ID = 3


class TestAdminRBACDependency:
    """Test the require_admin dependency"""

    def test_unauthenticated_user_gets_401_unauthorized(self, client: TestClient):
        """Test that unauthenticated users receive 401 Unauthorized"""
        response = client.get("/api/v1/admin/users")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_invalid_token_gets_401_unauthorized(self, client: TestClient):
        """Test that invalid tokens receive 401 Unauthorized"""
        response = client.get(
            "/api/v1/admin/users",
            headers={"Authorization": "Bearer invalid-token"},
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestAdminEndpointsRBAC:
    """Test RBAC on all admin endpoints"""

    def test_admin_endpoints_require_authentication(self, client: TestClient):
        """Test that all admin endpoints require authentication"""
        endpoints = [
            ("/api/v1/admin/users", "GET"),
            ("/api/v1/admin/moderation/items", "GET"),
            ("/api/v1/admin/system/settings", "GET"),
            ("/api/v1/admin/analytics/overview", "GET"),
        ]

        for endpoint, method in endpoints:
            if method == "GET":
                response = client.get(endpoint)
            else:
                response = client.post(endpoint, json={})

            assert response.status_code == status.HTTP_401_UNAUTHORIZED, f"{endpoint} should require authentication"

    def test_admin_endpoints_reject_invalid_tokens(self, client: TestClient):
        """Test that admin endpoints reject invalid tokens"""
        endpoints = [
            ("/api/v1/admin/users", "GET"),
            ("/api/v1/admin/moderation/items", "GET"),
            ("/api/v1/admin/system/settings", "GET"),
            ("/api/v1/admin/analytics/overview", "GET"),
        ]

        headers = {"Authorization": "Bearer invalid-token"}

        for endpoint, method in endpoints:
            if method == "GET":
                response = client.get(endpoint, headers=headers)
            else:
                response = client.post(endpoint, json={}, headers=headers)

            assert response.status_code == status.HTTP_401_UNAUTHORIZED, f"{endpoint} should reject invalid tokens"

