from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(str(settings.DATABASE_URL), pool_pre_ping=True)

def init_db():
    SQLModel.metadata.create_all(engine)

@contextmanager
def get_session():
    with Session(engine) as session:
        yield session