FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=1.5.1
ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app


COPY pyproject.toml poetry.lock* /app/
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-root --only main


COPY . /app

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8000"]