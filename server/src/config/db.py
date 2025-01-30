from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from contextlib import contextmanager

DATABASE_URL = "sqlite:///./storage.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False,
                            autoflush=False,
                            bind=engine)

Base = declarative_base()


@contextmanager
def db_session():
    """
    Context manager for database session.
    """
    session = SessionLocal()
    try:
        yield session
        session.expunge_all()
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def init_db():
    Base.metadata.create_all(bind=engine)
