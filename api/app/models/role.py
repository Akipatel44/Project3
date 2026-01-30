# Role database model
from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.session import Base
from datetime import datetime

class Role(Base):
    """Role model for user authorization"""
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f"<Role(id={self.id}, name='{self.name}')>"
