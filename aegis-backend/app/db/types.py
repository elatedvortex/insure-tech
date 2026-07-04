"""
Cross-database column helpers.
Uses Postgres-native types when available, falls back to TEXT/JSON for SQLite.
"""
import uuid

from sqlalchemy import JSON, Text
from sqlalchemy.dialects.postgresql import JSONB as PG_JSONB, UUID as PG_UUID
from sqlalchemy.types import TypeDecorator, String


class GUID(TypeDecorator):
    """Platform-independent UUID type. Uses Postgres UUID natively, TEXT elsewhere."""

    impl = String
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(String(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "postgresql":
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if not isinstance(value, uuid.UUID):
            return uuid.UUID(value)
        return value


class FlexJSONB(TypeDecorator):
    """JSONB on Postgres, generic JSON elsewhere (SQLite-compatible)."""

    impl = JSON
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_JSONB())
        return dialect.type_descriptor(JSON())


FlexJSON = JSON
