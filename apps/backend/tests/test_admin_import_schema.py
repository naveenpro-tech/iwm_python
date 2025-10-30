"""
Tests for admin import schema and template generator endpoints
"""

import pytest
from src.routers.admin import ImportSchemaResponse, ImportTemplateResponse, get_import_schema, get_import_template


@pytest.mark.asyncio
class TestImportSchemaEndpoint:
    """Tests for GET /api/admin/import/schema endpoint"""

    async def test_get_import_schema_success(self):
        """Test successful retrieval of import schema"""
        data = await get_import_schema()

        # Verify schema structure
        assert data.version == "1.0.0"
        assert data.description is not None
        assert len(data.fields) > 0
        assert data.example is not None

    async def test_import_schema_has_required_fields(self):
        """Test that schema includes all required fields"""
        data = await get_import_schema()

        field_names = [f.name for f in data.fields]

        # Check for essential fields
        assert "external_id" in field_names
        assert "title" in field_names
        assert "year" in field_names
        assert "genres" in field_names
        assert "directors" in field_names
        assert "cast" in field_names

    async def test_import_schema_field_structure(self):
        """Test that each field has required properties"""
        data = await get_import_schema()

        for field in data.fields:
            assert field.name is not None
            assert field.type is not None
            assert isinstance(field.required, bool)
            assert field.description is not None

    async def test_import_schema_external_id_required(self):
        """Test that external_id is marked as required"""
        data = await get_import_schema()

        external_id_field = next(f for f in data.fields if f.name == "external_id")
        assert external_id_field.required is True

    async def test_import_schema_title_required(self):
        """Test that title is marked as required"""
        data = await get_import_schema()

        title_field = next(f for f in data.fields if f.name == "title")
        assert title_field.required is True

    async def test_import_schema_example_provided(self):
        """Test that schema includes example data"""
        data = await get_import_schema()

        example = data.example
        assert isinstance(example, dict)
        assert "external_id" in example
        assert "title" in example
        assert "genres" in example

    async def test_import_schema_field_types(self):
        """Test that field types are valid"""
        data = await get_import_schema()

        valid_types = [
            "string", "integer", "number", "boolean",
            "array[string]", "array[object]", "object"
        ]

        for field in data.fields:
            assert field.type in valid_types


@pytest.mark.asyncio
class TestImportTemplateEndpoint:
    """Tests for GET /api/admin/import/template endpoint"""

    async def test_get_import_template_success(self):
        """Test successful retrieval of import template"""
        data = await get_import_template()

        # Verify template structure
        assert len(data.template) > 0
        assert data.description is not None

    async def test_import_template_has_sample_movie(self):
        """Test that template includes sample movie data"""
        data = await get_import_template()

        assert len(data.template) > 0
        sample = data.template[0]

        # Verify sample has required fields
        assert "external_id" in sample
        assert "title" in sample
        assert "year" in sample

    async def test_import_template_sample_structure(self):
        """Test that sample movie has proper structure"""
        data = await get_import_template()

        sample = data.template[0]

        # Verify field types
        assert isinstance(sample["external_id"], str)
        assert isinstance(sample["title"], str)
        assert isinstance(sample["year"], str)
        assert isinstance(sample["genres"], list)
        assert isinstance(sample["directors"], list)
        assert isinstance(sample["cast"], list)

    async def test_import_template_cast_structure(self):
        """Test that cast members have proper structure"""
        data = await get_import_template()

        sample = data.template[0]
        cast = sample["cast"]

        assert len(cast) > 0
        for member in cast:
            assert "name" in member
            assert "character" in member
            assert isinstance(member["name"], str)
            assert isinstance(member["character"], str)

    async def test_import_template_directors_structure(self):
        """Test that directors have proper structure"""
        data = await get_import_template()

        sample = data.template[0]
        directors = sample["directors"]

        assert len(directors) > 0
        for director in directors:
            assert "name" in director
            assert isinstance(director["name"], str)

    async def test_import_template_scores_are_numbers(self):
        """Test that rating scores are numeric"""
        data = await get_import_template()

        sample = data.template[0]

        if "siddu_score" in sample:
            assert isinstance(sample["siddu_score"], (int, float))
        if "critics_score" in sample:
            assert isinstance(sample["critics_score"], (int, float))
        if "imdb_rating" in sample:
            assert isinstance(sample["imdb_rating"], (int, float))

    async def test_import_template_description_provided(self):
        """Test that template includes description"""
        data = await get_import_template()

        assert data.description is not None
        assert isinstance(data.description, str)
        assert len(data.description) > 0


@pytest.mark.asyncio
class TestImportSchemaAndTemplateConsistency:
    """Tests for consistency between schema and template"""

    async def test_template_fields_match_schema(self):
        """Test that template uses fields defined in schema"""
        schema_data = await get_import_schema()
        template_data = await get_import_template()

        schema_field_names = {f.name for f in schema_data.fields}
        template_sample = template_data.template[0]
        template_field_names = set(template_sample.keys())

        # All template fields should be in schema
        for field_name in template_field_names:
            assert field_name in schema_field_names, f"Template field '{field_name}' not in schema"

    async def test_schema_example_matches_template(self):
        """Test that schema example is similar to template"""
        schema_data = await get_import_schema()
        template_data = await get_import_template()

        schema_example = schema_data.example
        template_sample = template_data.template[0]

        # Both should have the same key fields
        assert "external_id" in schema_example
        assert "external_id" in template_sample
        assert "title" in schema_example
        assert "title" in template_sample

