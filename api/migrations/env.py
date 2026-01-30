# Alembic configuration
"""Alembic environment for database migrations with SQLAlchemy model detection"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context
import os
import sys
from pathlib import Path
from urllib.parse import quote

# Add app path to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database.session import Base
from app.core.config import settings
# Import all models to register them with Base.metadata
from app.models import Role, User, Place, Event, Gallery

# Alembic Config object
config = context.config

# Create URL with proper encoding (avoiding ConfigParser interpolation issues)
encoded_password = quote(settings.DATABASE_PASSWORD, safe='')
database_url = (
    f"mysql+pymysql://{settings.DATABASE_USER}:{encoded_password}"
    f"@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}"
)

# Set sqlalchemy.url using the properly encoded URL
# We use raw string to avoid ConfigParser interpolation issues
try:
    config.set_main_option("sqlalchemy.url", database_url)
except ValueError:
    # If ConfigParser complains, we'll use the URL directly in run_migrations functions
    pass

# Logging configuration
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for model detection
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode"""
    url = database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        as_sql=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode"""
    # Create engine directly from the URL
    url = database_url
    connectable = create_engine(url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    try:
        run_migrations_online()
    except Exception as e:
        print(f"\n⚠️  Database connection failed: {str(e)}")
        print("   Running migration in offline mode instead...")
        run_migrations_offline()
