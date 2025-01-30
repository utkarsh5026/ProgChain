from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table, Index
from sqlalchemy.orm import relationship, joinedload
from config.db import Base, db_session
from pydantic import BaseModel


problem_tags = Table(
    'problem_tags',
    Base.metadata,
    Column('problem_id', Integer, ForeignKey('problems.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)


class Problem(Base):
    __tablename__ = 'problems'
    __table_args__ = (
        Index('ix_problems_name', 'name'),
    )
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


def get_all_problems():
    with db_session() as session:
        problems = session.query(Problem).options(
            joinedload(Problem.tags)
        ).all()
        for problem in problems:
            _ = [tag.name for tag in problem.tags]
        return problems


def find_problem_by_name(name: str):
    with db_session() as session:
        return session.query(Problem).filter(Problem.name == name).options(
            joinedload(Problem.tags)
        ).first()


def search_problems_with_name(name: str, limit: int = 10):
    with db_session() as session:
        return session.query(Problem).filter(Problem.name.like(f"%{name}%")).options(
            joinedload(Problem.tags)
        ).limit(limit).all()


def get_problems_by_tags(tags: list[str]):
    with db_session() as session:
        return session.query(Problem).filter(Problem.tags.in_(tags)).options(
            joinedload(Problem.tags)
        ).all()
