"""
Application configuration
Loads environment variables and provides configuration settings
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "hrms_db"
    
    # Server
    port: int = 8000
    environment: str = "development"
    
    # CORS
    allowed_origins: str = "*"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def get_allowed_origins(self) -> List[str]:
        """Parse allowed origins from comma-separated string"""
        if self.allowed_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.allowed_origins.split(",")]


# Global settings instance
settings = Settings()
