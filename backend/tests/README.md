# Critic Platform Backend Testing Suite

Comprehensive testing suite for the Critic Platform MVP backend implementation.

## Overview

This testing suite provides **90%+ code coverage** for all critic platform features including:
- Repository layer (data access)
- API endpoints (request/response)
- RBAC (role-based access control)
- E2E flows (end-to-end user journeys)

## Test Structure

```
tests/
├── conftest.py                          # Shared fixtures and configuration
├── pytest.ini                           # Pytest configuration
├── repositories/                        # Repository layer unit tests
│   ├── test_critic_blog_repository.py
│   ├── test_critic_recommendations_repository.py
│   ├── test_critic_pinned_repository.py
│   ├── test_critic_affiliate_repository.py
│   └── test_critic_brand_deals_repository.py
├── api/                                 # API integration tests
│   ├── test_critic_blog_api.py
│   ├── test_critic_recommendations_api.py
│   ├── test_critic_pinned_api.py
│   ├── test_critic_affiliate_api.py
│   └── test_critic_brand_deals_api.py
├── test_critic_rbac.py                  # RBAC permission tests
└── e2e/                                 # End-to-end tests
    ├── test_critic_studio_flow.py
    ├── test_admin_verification_flow.py
    ├── test_public_profile_flow.py
    └── test_sponsor_disclosure_flow.py
```

## Running Tests

### Run All Tests
```bash
cd apps/backend
pytest
```

### Run Specific Test Categories
```bash
# Repository layer tests only
pytest -m unit

# API integration tests only
pytest -m integration

# RBAC tests only
pytest -m rbac

# E2E tests only
pytest -m e2e
```

### Run Specific Test File
```bash
pytest tests/repositories/test_critic_blog_repository.py
pytest tests/api/test_critic_blog_api.py
```

### Run with Coverage Report
```bash
pytest --cov=src --cov-report=html --cov-report=term-missing
```

This generates:
- Terminal output showing coverage percentages
- HTML report in `htmlcov/index.html`

### Run Tests in Parallel (Faster)
```bash
pytest -n auto
```

## Test Fixtures

### Database Fixtures
- `async_engine` - Async SQLAlchemy engine with in-memory SQLite
- `async_db_session` - Async database session with transaction rollback

### User Fixtures
- `test_user` - Regular user (not a critic)
- `test_critic_user` - Verified critic user
- `test_other_critic_user` - Another critic (for ownership tests)
- `test_admin_user` - Admin user

### Authentication Fixtures
- `auth_headers_user` - JWT token for regular user
- `auth_headers_critic` - JWT token for critic
- `auth_headers_other_critic` - JWT token for other critic
- `auth_headers_admin` - JWT token for admin

### Test Data Fixtures
- `test_movie` - Sample movie
- `test_genre` - Sample genre
- `test_critic_profile` - Critic profile for test_critic_user
- `test_other_critic_profile` - Critic profile for test_other_critic_user

## Test Coverage Goals

### Repository Layer (Unit Tests)
- **Target:** 90%+ coverage per file
- **Focus:** Data access logic, edge cases, error handling
- **Files:** 5 repository test files

### API Layer (Integration Tests)
- **Target:** 100% endpoint coverage
- **Focus:** Request validation, response formats, authentication
- **Files:** 5 API test files

### RBAC (Permission Tests)
- **Target:** 100% permission scenario coverage
- **Focus:** All user roles × all endpoints
- **Files:** 1 RBAC test file

### E2E (End-to-End Tests)
- **Target:** All critical user flows
- **Focus:** Real user journeys through the UI
- **Files:** 4 E2E test files

## Test Markers

Tests are marked with pytest markers for easy filtering:

- `@pytest.mark.unit` - Repository layer unit tests
- `@pytest.mark.integration` - API integration tests
- `@pytest.mark.rbac` - RBAC permission tests
- `@pytest.mark.e2e` - End-to-end tests
- `@pytest.mark.slow` - Tests that take >5 seconds

## Writing New Tests

### Repository Test Template
```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from src.repositories.your_repository import YourRepository
from src.schemas.your_schema import YourCreate, YourUpdate

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating a resource successfully"""
    repo = YourRepository(async_db_session)
    
    data = YourCreate(field="value")
    result = await repo.create(test_critic_profile.id, data)
    
    assert result is not None
    assert result.field == "value"
```

### API Test Template
```python
import pytest
from fastapi.testclient import TestClient

@pytest.mark.asyncio
@pytest.mark.integration
async def test_create_endpoint(
    client: TestClient,
    auth_headers_critic: dict,
    async_db_session: AsyncSession
):
    """Test POST /api/v1/resource endpoint"""
    response = client.post(
        "/api/v1/resource",
        json={"field": "value"},
        headers=auth_headers_critic
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["field"] == "value"
```

### RBAC Test Template
```python
import pytest
from fastapi.testclient import TestClient

@pytest.mark.rbac
def test_endpoint_requires_critic_role(
    client: TestClient,
    auth_headers_user: dict
):
    """Test that regular users cannot access critic-only endpoint"""
    response = client.post(
        "/api/v1/critic-blog",
        json={"title": "Test"},
        headers=auth_headers_user
    )
    
    assert response.status_code == 403
```

## Continuous Integration

Tests run automatically on:
- Every pull request
- Every push to main branch
- Nightly builds

CI configuration:
- GitHub Actions workflow: `.github/workflows/test.yml`
- Coverage threshold: 85% minimum
- All tests must pass before merge

## Troubleshooting

### Tests Fail with "Database Locked"
- SQLite in-memory database doesn't support concurrent writes
- Run tests sequentially: `pytest -n 0`

### Tests Fail with "Fixture Not Found"
- Ensure `conftest.py` is in the correct location
- Check fixture dependencies (some fixtures depend on others)

### Tests Fail with "Module Not Found"
- Activate virtual environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
- Install dependencies: `pip install -r requirements.txt`

### Coverage Report Shows Low Coverage
- Check if all test files are being discovered: `pytest --collect-only`
- Ensure test files follow naming convention: `test_*.py`
- Verify pytest.ini configuration is correct

## Best Practices

1. **Test Isolation:** Each test should be independent and not rely on other tests
2. **Transaction Rollback:** Use `async_db_session` fixture for automatic cleanup
3. **Descriptive Names:** Test names should describe what they test
4. **Arrange-Act-Assert:** Structure tests with clear setup, execution, and verification
5. **Edge Cases:** Test both success and failure scenarios
6. **Mock External Services:** Don't make real API calls to TMDB, Gemini, etc.

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Async Testing](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Playwright Python](https://playwright.dev/python/)

## Contact

For questions or issues with tests, contact the IWM Development Team.

