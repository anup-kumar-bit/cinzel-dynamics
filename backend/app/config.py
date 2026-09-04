from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24 * 7  # 7 days — matches the frontend's current session length

    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    # Comma-separated list of origins allowed to send credentialed requests
    # (the Next.js frontend's own URL — localhost in dev, the real domain in prod).
    cors_origins: str = "http://localhost:3000"

    is_production: bool = False


settings = Settings()
