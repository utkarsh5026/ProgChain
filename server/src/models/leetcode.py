from pathlib import Path
from pydantic import BaseModel
import json
import os
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Session
from .setup import Base


PROBLEMS_FILE_NAME = 'leetcode_problems.json'
DETAILED_PROBLEMS_PATH = Path(__file__).resolve(
).parent.parent.parent / 'data' / 'leetcode_problems'

PROBLEM_FILE_PATH = Path(__file__).resolve(
).parent.parent.parent / 'data' / PROBLEMS_FILE_NAME

# Add this before the Problem class definition
problem_tags = Table(
    'problem_tags',
    Base.metadata,
    Column('problem_id', Integer, ForeignKey('problems.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)


class Problem(Base):
    __tablename__ = 'problems'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    acceptance_rate = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    tags = relationship('Tag', secondary='problem_tags',
                        back_populates='problems')
    code_generated = relationship(
        'ProblemCodeGenerated', back_populates='problem')


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    problems = relationship('Problem', secondary='problem_tags',
                            back_populates='tags')


class ProblemCodeGenerated(Base):
    __tablename__ = 'problem_code_generated'
    id = Column(Integer, primary_key=True, index=True)
    solution = Column(String, nullable=False)
    model = Column(String, nullable=False)
    language = Column(String, nullable=False)
    problem_id = Column(Integer, ForeignKey('problems.id'))
    problem = relationship('Problem', back_populates='code_generated')


class ProblemsResult(BaseModel):
    problems: list[dict]
    total: int
    page: int
    limit: int
    total_pages: int


def load_problems_from_file() -> list:
    file_path = os.path.join(os.path.dirname(
        __file__), '..', '..', 'data', PROBLEMS_FILE_NAME)
    with open(file_path, 'r') as file:
        data = json.load(file)

    return data


def filter_problem_names(probs: list[dict]):
    problem_names = []
    for problem in probs:
        if 'problem' in problem:
            problem_name = problem['problem']
            parts = problem_name.split('.')

            if len(parts) > 1:
                problem_names.append(parts[1].strip())

    return problem_names


def filter_problems(probs: list[dict], page: int, limit: int):
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_problems = probs[start_index:end_index]
    total_problems = len(probs)
    total_pages = (total_problems + limit - 1) // limit

    return ProblemsResult(
        problems=paginated_problems,
        total=total_problems,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


def add_problems_to_db(session: Session):
    try:
        if not PROBLEM_FILE_PATH.exists():
            print(f"Problem file not found at: {PROBLEM_FILE_PATH}")
            raise FileNotFoundError(f"File not found: {PROBLEM_FILE_PATH}")

        print(f"Using problems file at: {PROBLEM_FILE_PATH}")
        print("Starting problem import...")

        existing_problems = {
            prob.name.strip(): prob for prob in session.query(Problem).all()}
        print(f"Found {len(existing_problems)} existing problems")

        existing_tags = {tag.name: tag for tag in session.query(Tag).all()}
        print(f"Found {len(existing_tags)} existing tags")

        data = load_problems_from_file()
        print(f"Loaded {len(data)} problems from file")

        new_problems = []
        updated_problems = []
        tag_set = set()

        unprocessed = 0
        for idx, problem in enumerate(data, 1):
            try:
                if idx % 100 == 0:
                    print(f"Processing problem {idx}/{len(data)}")

                problem_name = problem['problem']
                if '.' not in problem_name:
                    print(f"Skipping malformed problem name: {problem_name}")
                    continue

                problem_cnt, problem_name_clean = problem_name.split('.')
                problem_name_clean = problem_name_clean.strip()
                parsed_name = f"{problem_cnt}_{
                    '_'.join(problem_name.split())}.json"
                problem_path = DETAILED_PROBLEMS_PATH / parsed_name

                if not problem_path.exists():
                    print(f"Problem detail file not found: {parsed_name}")
                    unprocessed += 1
                    continue

                with open(problem_path, 'r') as file:
                    problem_data = json.load(file)
                    tags = [tag['name']
                            for tag in problem_data.get('tags', [])]
                    tag_set.update(tags)

                    acceptance_rate = float(
                        problem['acceptance_rate'].replace('%', ''))
                    if problem_name_clean in existing_problems:
                        problem_obj = existing_problems[problem_name_clean]
                        problem_obj.difficulty = problem['difficulty']
                        problem_obj.acceptance_rate = acceptance_rate
                        problem_obj.description = problem_data['description']
                        updated_problems.append(problem_obj)
                    else:
                        problem_obj = Problem(
                            name=problem_name_clean,
                            difficulty=problem['difficulty'],
                            acceptance_rate=acceptance_rate,
                            description=problem_data['description']
                        )
                        new_problems.append(problem_obj)
                        existing_problems[problem_name_clean] = problem_obj

                    for tag_name in tags:
                        if tag_name not in existing_tags:
                            tag_obj = Tag(name=tag_name)
                            session.add(tag_obj)
                            existing_tags[tag_name] = tag_obj

                    problem_obj.tags = [existing_tags[tag_name]
                                        for tag_name in tags]

            except Exception as e:
                print(f"Error processing problem {problem_name}: {str(e)}")
                continue

        print(f"Unprocessed {unprocessed}")
        # Commit in batches
        try:
            if new_problems:
                print(f"Adding {len(new_problems)} new problems...")
                session.add_all(new_problems)
                session.flush()

            if updated_problems:
                print(f"Updating {len(updated_problems)} existing problems...")
                session.flush()

            session.commit()
            print(f"Successfully added {len(new_problems)} new problems and updated {
                  len(updated_problems)} problems")

        except Exception as e:
            print(f"Error during database commit: {str(e)}")
            session.rollback()
            raise

    except Exception as e:
        print(f"Error during problem import: {str(e)}")
        session.rollback()
        raise
    finally:
        session.close()


def add_tags(tags: list[str], session: Session):
    existing_tags = {tag.name for tag in session.query(Tag).all()}

    new_tags = []
    for tag in tags:
        if tag not in existing_tags:
            tag_obj = Tag(name=tag)
            new_tags.append(tag_obj)
            existing_tags.add(tag)

    if new_tags:
        session.add_all(new_tags)
        session.commit()


problems = load_problems_from_file()
problem_names = filter_problem_names(problems)
