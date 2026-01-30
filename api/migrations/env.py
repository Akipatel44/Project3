# Alembic configuration
"""Alembic environment for database migrations with SQLAlchemy model detection"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context
import os
import sys
from pathlib import Path

# Add app path to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database.session import Base
from app.core.config import settings
# Import all models to register them with Base.metadata
from app.models import Role, User

# Alembic Config object
config = context.config

# Set sqlalchemy.url from application settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Logging configuration
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for model detection
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode"""
    url = config.get_main_option("sqlalchemy.url")
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
    url = config.get_main_option("sqlalchemy.url")
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
