from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


def _build_database_url() -> str:
    user = settings.DB_USER
    password = settings.DB_PASSWORD
    host = settings.DB_HOST or "localhost"
    port = settings.DB_PORT or "3306"
    name = settings.DB_NAME
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"


class Base(DeclarativeBase):
    pass


engine = create_engine(
    _build_database_url(),
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
