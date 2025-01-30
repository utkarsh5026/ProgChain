from .setup import engine, Base, SessionLocal
from .leetcode import Problem, Tag, ProblemCodeGenerated, add_problems_to_db


def init_db(should_import_problems=True):
    Base.metadata.create_all(bind=engine)
    if should_import_problems:
        session = SessionLocal()
        try:
            add_problems_to_db(session)
        except Exception as e:
            print(f"Failed to import problems: {str(e)}")
        finally:
            session.close()


init_db(should_import_problems=False)
