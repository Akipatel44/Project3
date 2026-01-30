# Apply Alembic migrations
"""
Usage:
    python migrate.py upgrade  # Apply pending migrations
    python migrate.py downgrade
    python migrate.py current  # Show current revision
    python migrate.py history  # Show migration history
"""

import sys
from alembic.config import Config
from alembic import command

def run_migration(command_name: str = "upgrade"):
    """Run Alembic migrations"""
    alembic_cfg = Config("alembic.ini")
    
    try:
        if command_name == "upgrade":
            print("🚀 Upgrading database...")
            command.upgrade(alembic_cfg, "head")
            print("✅ Database upgrade complete!")
            
        elif command_name == "downgrade":
            print("⬇️  Downgrading database...")
            command.downgrade(alembic_cfg, "-1")
            print("✅ Database downgrade complete!")
            
        elif command_name == "current":
            print("📍 Current revision:")
            command.current(alembic_cfg)
            
        elif command_name == "history":
            print("📋 Migration history:")
            command.history(alembic_cfg)
        else:
            print(f"❌ Unknown command: {command_name}")
            print("Available commands: upgrade, downgrade, current, history")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\nMake sure:")
        print("  1. MySQL server is running")
        print("  2. Database credentials are correct in .env")
        print("  3. Database 'osamvista' exists")
        raise

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "upgrade"
    run_migration(cmd)
