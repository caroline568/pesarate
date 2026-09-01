import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


def _normalize_db_uri(raw_uri):
    """Point Postgres URLs at the psycopg3 driver (postgresql+psycopg://),
    which ships prebuilt wheels for current Python versions — unlike
    psycopg2-binary, whose wheels can lag behind a new Python release and
    fail with an ABI mismatch on hosts (e.g. Render) that default to it.
    SQLite (local dev default) is left untouched.
    """
    uri = raw_uri.replace("postgres://", "postgresql://", 1)
    if uri.startswith("postgresql://"):
        uri = uri.replace("postgresql://", "postgresql+psycopg://", 1)
    return uri


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # Supabase/Postgres in production; falls back to a local sqlite file so
    # the API is runnable without any setup during development.
    SQLALCHEMY_DATABASE_URI = _normalize_db_uri(
        os.environ.get("DATABASE_URL", "sqlite:///pesarate.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Parse CORS origins: can be comma-separated string. Include Vite's fallback
    # port because it moves to 5174 when 5173 is already in use.
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS", "http://localhost:5173,http://localhost:5174"
        ).split(",")
    ]

    # Used to verify Google Sign-In ID tokens server-side.
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")

    # Log CORS configuration for debugging
    @classmethod
    def log_config(cls):
        """Print current config for debugging; useful in logs to verify env vars were loaded"""
        print(f"CORS_ORIGINS: {cls.CORS_ORIGINS}")
        print(f"DATABASE_URL: {'postgresql' if 'postgresql' in cls.SQLALCHEMY_DATABASE_URI else 'sqlite'}")
        print(f"JWT_SECRET_KEY: {'set' if cls.JWT_SECRET_KEY != 'dev-jwt-secret' else 'using dev default'}")
