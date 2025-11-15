# ProgChain Development Roadmap

## Overview
This roadmap outlines a step-by-step plan to transform ProgChain from a functional prototype into a production-ready, well-tested, and maintainable application.

**Estimated Timeline**: 8-10 weeks
**Team Size**: 1-3 developers

---

## Table of Contents
1. [Phase 1: Testing Foundation](#phase-1-testing-foundation)
2. [Phase 2: CI/CD & Automation](#phase-2-cicd--automation)
3. [Phase 3: Database & Infrastructure](#phase-3-database--infrastructure)
4. [Phase 4: Security & Authentication](#phase-4-security--authentication)
5. [Phase 5: Monitoring & Observability](#phase-5-monitoring--observability)
6. [Phase 6: Performance & Optimization](#phase-6-performance--optimization)
7. [Testing in Docker Environments](#testing-in-docker-environments)

---

## Phase 1: Testing Foundation
**Duration**: Week 1-2
**Priority**: CRITICAL

### 1.1 Backend Testing Setup

#### Step 1: Install Testing Dependencies
```bash
cd server
# Add to requirements.txt:
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
pytest-mock==3.12.0
httpx==0.25.0  # Already installed, for FastAPI testing
factory-boy==3.3.0  # For test data generation
faker==20.1.0
```

#### Step 2: Create Testing Directory Structure
```bash
mkdir -p server/tests/{unit,integration,e2e,fixtures,mocks}
touch server/tests/__init__.py
touch server/tests/conftest.py
touch server/pytest.ini
```

#### Step 3: Configure pytest
Create `server/pytest.ini`:
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
addopts =
    -v
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=70
```

#### Step 4: Create Test Fixtures
Create `server/tests/conftest.py`:
```python
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from src.db.config import Base
from src.server import app

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def test_db():
    """Create test database"""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture(scope="function")
async def test_session(test_db):
    """Create test database session"""
    TestSessionLocal = sessionmaker(
        test_db, class_=AsyncSession, expire_on_commit=False
    )
    async with TestSessionLocal() as session:
        yield session

@pytest.fixture(scope="function")
async def client():
    """Create test client"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

#### Step 5: Write First Unit Tests
Create `server/tests/unit/test_topics.py`:
```python
import pytest
from src.features.topics.models import TopicChain, Topic

@pytest.mark.asyncio
async def test_create_topic_chain(test_session):
    """Test topic chain creation"""
    topic_chain = TopicChain(
        topic_path="Python > Async Programming",
        public_id="test-chain-123"
    )
    test_session.add(topic_chain)
    await test_session.commit()

    result = await test_session.get(TopicChain, topic_chain.id)
    assert result is not None
    assert result.topic_path == "Python > Async Programming"

@pytest.mark.asyncio
async def test_topic_validation():
    """Test topic model validation"""
    # Add validation tests here
    pass
```

#### Step 6: Write Integration Tests
Create `server/tests/integration/test_topics_api.py`:
```python
import pytest

@pytest.mark.asyncio
async def test_create_topic_chain_endpoint(client):
    """Test POST /topics/create-topic-chain"""
    response = await client.post(
        "/topics/create-topic-chain",
        json={
            "topic_path": "Python > Functions",
            "conversation_id": "test-conv-123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "topic_chain_id" in data

@pytest.mark.asyncio
async def test_generate_topics_endpoint(client):
    """Test POST /topics/generate"""
    response = await client.post(
        "/topics/generate",
        json={
            "topic_path": "Python",
            "topic_chain_id": "test-id",
            "conversation_id": "conv-123",
            "model": "gpt-4"
        }
    )
    assert response.status_code == 200
```

#### Step 7: Run Tests
```bash
cd server
pytest
pytest --cov=src --cov-report=html
```

**Deliverables**:
- [ ] pytest configured with async support
- [ ] Test fixtures for database and client
- [ ] At least 10 unit tests written
- [ ] At least 5 integration tests written
- [ ] Test coverage > 70%

---

### 1.2 Frontend Testing Setup

#### Step 1: Install Testing Dependencies
```bash
cd client
npm install -D \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  msw
```

#### Step 2: Configure Vitest
Create `client/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### Step 3: Create Test Setup
Create `client/src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

#### Step 4: Write Component Tests
Create `client/src/components/topics/__tests__/AskTopic.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AskTopic } from '../AskTopic'

describe('AskTopic Component', () => {
  it('renders topic input field', () => {
    render(<AskTopic />)
    expect(screen.getByPlaceholderText(/enter topic/i)).toBeInTheDocument()
  })

  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn()
    render(<AskTopic onSubmit={onSubmit} />)

    const input = screen.getByPlaceholderText(/enter topic/i)
    fireEvent.change(input, { target: { value: 'React Hooks' } })

    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith('React Hooks')
  })
})
```

#### Step 5: Add Test Scripts
Update `client/package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### Step 6: Run Tests
```bash
cd client
npm test
npm run test:coverage
```

**Deliverables**:
- [ ] Vitest configured with React Testing Library
- [ ] Test setup with cleanup
- [ ] At least 15 component tests
- [ ] Test coverage > 60%

---

## Phase 2: CI/CD & Automation
**Duration**: Week 3-4
**Priority**: HIGH

### 2.1 GitHub Actions Setup

#### Step 1: Create Workflow Directory
```bash
mkdir -p .github/workflows
```

#### Step 2: Backend CI Workflow
Create `.github/workflows/backend-ci.yml`:
```yaml
name: Backend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'server/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'server/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        cache: 'pip'

    - name: Install dependencies
      run: |
        cd server
        pip install -r requirements.txt

    - name: Run linting
      run: |
        cd server
        pip install black ruff mypy
        black --check src
        ruff check src
        mypy src --ignore-missing-imports

    - name: Run tests
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      run: |
        cd server
        pytest --cov=src --cov-report=xml

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./server/coverage.xml
        flags: backend
```

#### Step 3: Frontend CI Workflow
Create `.github/workflows/frontend-ci.yml`:
```yaml
name: Frontend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'client/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'client/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: client/package-lock.json

    - name: Install dependencies
      run: |
        cd client
        npm ci

    - name: Run linting
      run: |
        cd client
        npm run lint

    - name: Type check
      run: |
        cd client
        npx tsc --noEmit

    - name: Run tests
      run: |
        cd client
        npm run test:coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./client/coverage/lcov.info
        flags: frontend
```

#### Step 4: Docker Build Workflow
Create `.github/workflows/docker-build.yml`:
```yaml
name: Docker Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Build server image
      uses: docker/build-push-action@v4
      with:
        context: ./server
        file: ./server/Dockerfile
        push: false
        tags: progchain-server:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Build client image
      uses: docker/build-push-action@v4
      with:
        context: ./client
        file: ./client/Dockerfile
        push: false
        tags: progchain-client:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Run security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: progchain-server:latest
        format: 'sarif'
        output: 'trivy-results.sarif'
```

### 2.2 Pre-commit Hooks

#### Step 1: Install pre-commit
```bash
pip install pre-commit
```

#### Step 2: Create Configuration
Create `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict

  - repo: https://github.com/psf/black
    rev: 23.11.0
    hooks:
      - id: black
        files: ^server/

  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.1.6
    hooks:
      - id: ruff
        files: ^server/
        args: [--fix]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.1
    hooks:
      - id: mypy
        files: ^server/
        additional_dependencies: [types-all]

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.54.0
    hooks:
      - id: eslint
        files: ^client/
        types: [file]
        types_or: [javascript, jsx, ts, tsx]
```

#### Step 3: Install Hooks
```bash
pre-commit install
pre-commit run --all-files
```

**Deliverables**:
- [ ] GitHub Actions workflows for backend, frontend, Docker
- [ ] Pre-commit hooks configured
- [ ] Code coverage reporting setup
- [ ] Security scanning enabled

---

## Phase 3: Database & Infrastructure
**Duration**: Week 5-6
**Priority**: MEDIUM-HIGH

### 3.1 Database Migration Setup

#### Step 1: Install Alembic
```bash
cd server
pip install alembic
```

#### Step 2: Initialize Alembic
```bash
cd server
alembic init alembic
```

#### Step 3: Configure Alembic
Edit `server/alembic/env.py`:
```python
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context
import asyncio

# Import your models
from src.db.config import Base, ASYNC_DATABASE_URL
from src.features.topics.models import *
from src.features.projects.models import *
from src.features.threads.models import *

config = context.config
config.set_main_option('sqlalchemy.url', ASYNC_DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
```

#### Step 4: Create Initial Migration
```bash
cd server
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

#### Step 5: Update Database Initialization
Edit `server/src/db/config.py`:
```python
# Remove or comment out the create_all approach
# async def init_db():
#     async with async_engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

# Add migration-based initialization
async def init_db():
    """Database is now managed through Alembic migrations"""
    from alembic.config import Config
    from alembic import command

    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
```

### 3.2 Environment Configuration

#### Step 1: Create Environment Files
Create `server/.env.example`:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./progchain.db
TEST_DATABASE_URL=sqlite+aiosqlite:///./test_progchain.db

# Server Configuration
DEBUG=true
HOST=0.0.0.0
PORT=8000
WORKERS=4

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Logging
LOG_LEVEL=INFO

# File Storage
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes

# Redis (for future caching)
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Create `client/.env.example`:
```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Development
VITE_HOST=0.0.0.0
```

#### Step 2: Create Configuration Module
Create `server/src/config/settings.py`:
```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str

    # Database
    database_url: str = "sqlite+aiosqlite:///./progchain.db"
    test_database_url: str = "sqlite+aiosqlite:///./test_progchain.db"

    # Server
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 4

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]

    # Logging
    log_level: str = "INFO"

    # File Storage
    upload_dir: str = "./uploads"
    max_upload_size: int = 10485760

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False
    )

settings = Settings()
```

**Deliverables**:
- [ ] Alembic configured and working
- [ ] Initial migration created
- [ ] Environment configuration centralized
- [ ] .env.example files created

---

## Phase 4: Security & Authentication
**Duration**: Week 7-8
**Priority**: HIGH (for production)

### 4.1 Authentication System

#### Step 1: Install Dependencies
```bash
cd server
pip install \
  python-jose[cryptography] \
  passlib[bcrypt] \
  python-multipart
```

#### Step 2: Create User Model
Create `server/src/features/auth/models.py`:
```python
from sqlalchemy import Column, String, Boolean
from src.db.config import Base
from src.db.mixins import TimestampMixin, PublicIDMixin

class User(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
```

#### Step 3: Create Authentication Service
Create `server/src/features/auth/service.py`:
```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from src.config.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

async def get_current_user(token: str):
    # Implementation
    pass
```

#### Step 4: Create Auth Endpoints
Create `server/src/features/auth/handler.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    # Implementation
    pass

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Implementation
    pass

@router.get("/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    # Implementation
    pass
```

### 4.2 Rate Limiting

#### Step 1: Install slowapi
```bash
cd server
pip install slowapi
```

#### Step 2: Configure Rate Limiting
Edit `server/src/fastapi_components/app.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply to specific routes
@router.post("/topics/generate")
@limiter.limit("10/minute")
async def generate_topics(request: Request, ...):
    ...
```

### 4.3 Security Headers

Create `server/src/fastapi_components/security.py`:
```python
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

# Add to app
app.add_middleware(SecurityHeadersMiddleware)
```

**Deliverables**:
- [ ] JWT-based authentication implemented
- [ ] User registration and login endpoints
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] Protected routes with authentication

---

## Phase 5: Monitoring & Observability
**Duration**: Week 9
**Priority**: MEDIUM (CRITICAL for production)

### 5.1 Structured Logging

#### Step 1: Enhanced Logging Configuration
Create `server/src/core/logging.py`:
```python
import sys
import json
from loguru import logger
from src.config.settings import settings

def serialize(record):
    subset = {
        "timestamp": record["time"].isoformat(),
        "level": record["level"].name,
        "message": record["message"],
        "module": record["name"],
        "function": record["function"],
        "line": record["line"],
    }
    return json.dumps(subset)

def setup_logging():
    logger.remove()

    if settings.debug:
        logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            level=settings.log_level
        )
    else:
        logger.add(
            sys.stdout,
            format=serialize,
            level=settings.log_level
        )

    logger.add(
        "logs/app_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="30 days",
        compression="zip",
        level=settings.log_level
    )
```

### 5.2 Error Tracking (Sentry)

#### Step 1: Install Sentry
```bash
cd server
pip install sentry-sdk[fastapi]
```

#### Step 2: Configure Sentry
Edit `server/src/fastapi_components/app.py`:
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

if not settings.debug:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,
        environment=settings.environment,
    )
```

### 5.3 Metrics & Health Checks

#### Step 1: Create Health Check Endpoint
Create `server/src/features/health/handler.py`:
```python
from fastapi import APIRouter, status
from pydantic import BaseModel
from datetime import datetime
from src.db.config import async_engine

router = APIRouter(prefix="/health", tags=["health"])

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    database: str
    version: str

@router.get("", response_model=HealthCheck)
async def health_check():
    # Check database
    try:
        async with async_engine.connect() as conn:
            await conn.execute("SELECT 1")
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"

    return HealthCheck(
        status="healthy" if db_status == "healthy" else "degraded",
        timestamp=datetime.utcnow(),
        database=db_status,
        version="1.0.0"
    )
```

**Deliverables**:
- [ ] Structured logging implemented
- [ ] Sentry error tracking configured
- [ ] Health check endpoints created
- [ ] Request correlation IDs added

---

## Phase 6: Performance & Optimization
**Duration**: Week 10
**Priority**: MEDIUM

### 6.1 Backend Caching

#### Step 1: Install Redis Client
```bash
cd server
pip install redis aioredis
```

#### Step 2: Create Cache Service
Create `server/src/core/cache/redis.py`:
```python
from typing import Optional
import json
import aioredis
from src.config.settings import settings

class RedisCache:
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None

    async def connect(self):
        self.redis = await aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )

    async def get(self, key: str) -> Optional[dict]:
        if not self.redis:
            return None
        value = await self.redis.get(key)
        return json.loads(value) if value else None

    async def set(self, key: str, value: dict, ttl: int = 3600):
        if not self.redis:
            return
        await self.redis.setex(key, ttl, json.dumps(value))

    async def delete(self, key: str):
        if not self.redis:
            return
        await self.redis.delete(key)

cache = RedisCache()
```

### 6.2 Frontend Optimization

#### Step 1: Code Splitting
Update `client/src/App.tsx`:
```typescript
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoadingAnimation from './components/utils/LoadingAnimation'

// Lazy load routes
const Topics = lazy(() => import('./components/topics/TopicExplorer'))
const Interview = lazy(() => import('./components/interview/Interview'))
const Projects = lazy(() => import('./components/projects/Projects'))
const Explore = lazy(() => import('./components/explore/Explore'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingAnimation />}>
        <Routes>
          <Route path="/topics" element={<Topics />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

#### Step 2: Bundle Analysis
```bash
cd client
npm run build
npx vite-bundle-visualizer
```

**Deliverables**:
- [ ] Redis caching implemented
- [ ] Frontend code splitting
- [ ] Bundle size optimized
- [ ] Database indexes added

---

# Testing in Docker Environments

## Overview
Testing containerized applications requires special considerations. This section covers comprehensive testing strategies for Docker-based development.

## 1. Local Development Testing

### 1.1 Database Testing in Docker

#### Strategy 1: Separate Test Database Container

Create `docker-compose.test.yml`:
```yaml
version: "3.8"

services:
  test-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: test_progchain
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    ports:
      - "5433:5432"
    tmpfs:
      - /var/lib/postgresql/data  # Use tmpfs for faster tests

  test-server:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    volumes:
      - ./server:/app
    environment:
      - DATABASE_URL=postgresql+asyncpg://test_user:test_password@test-db:5432/test_progchain
      - PYTHONPATH=/app/src
      - TESTING=true
    depends_on:
      - test-db
    command: pytest /app/tests -v --cov=src
```

**Usage**:
```bash
# Run all tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Run specific test file
docker-compose -f docker-compose.test.yml run test-server pytest tests/unit/test_topics.py

# Clean up
docker-compose -f docker-compose.test.yml down -v
```

#### Strategy 2: In-Container Testing with SQLite

Update `server/tests/conftest.py`:
```python
import os
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Use in-memory SQLite for fast tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="function")
async def test_db():
    """Create fresh in-memory database for each test"""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False}
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()
```

**Run tests inside container**:
```bash
# Exec into running container
docker exec -it progchain-server-1 bash
cd /app
pytest

# Or one-liner
docker exec progchain-server-1 pytest /app/tests -v
```

---

### 1.2 Integration Testing with Docker

#### Full Stack Integration Tests

Create `server/tests/integration/test_full_flow.py`:
```python
import pytest
from httpx import AsyncClient
import asyncio

@pytest.mark.asyncio
class TestFullTopicFlow:
    """Test complete topic generation flow"""

    async def test_create_and_generate_topics(self, client: AsyncClient):
        # Step 1: Create topic chain
        create_response = await client.post(
            "/topics/create-topic-chain",
            json={"topic_path": "Python > Async Programming"}
        )
        assert create_response.status_code == 200
        topic_chain_id = create_response.json()["topic_chain_id"]

        # Step 2: Generate topics
        generate_response = await client.post(
            "/topics/generate",
            json={
                "topic_path": "Python > Async Programming",
                "topic_chain_id": topic_chain_id,
                "conversation_id": "test-conv",
                "model": "gpt-4"
            }
        )
        assert generate_response.status_code == 200

        # Verify data persisted
        # ... additional assertions
```

**Run integration tests**:
```bash
# Run with docker-compose (starts all dependencies)
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml exec server pytest tests/integration -v
docker-compose -f docker-compose.dev.yml down
```

---

### 1.3 API Testing with Docker

#### Using Test Containers

Install testcontainers:
```bash
pip install testcontainers
```

Create `server/tests/conftest.py`:
```python
import pytest
from testcontainers.postgres import PostgresContainer
from testcontainers.redis import RedisContainer

@pytest.fixture(scope="session")
def postgres_container():
    """Start PostgreSQL container for testing"""
    with PostgresContainer("postgres:15-alpine") as postgres:
        yield postgres

@pytest.fixture(scope="session")
def redis_container():
    """Start Redis container for testing"""
    with RedisContainer("redis:7-alpine") as redis:
        yield redis

@pytest.fixture
async def test_db_url(postgres_container):
    """Get database URL from test container"""
    return postgres_container.get_connection_url().replace(
        "psycopg2", "asyncpg"
    )
```

---

## 2. CI/CD Testing in Docker

### 2.1 GitHub Actions with Docker

Create `.github/workflows/integration-tests.yml`:
```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Build and test with Docker Compose
        env:
          DATABASE_URL: postgresql+asyncpg://test_user:test_pass@postgres:5432/test_db
          REDIS_URL: redis://redis:6379/0
        run: |
          docker-compose -f docker-compose.test.yml build
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit
          docker-compose -f docker-compose.test.yml down -v
```

---

## 3. Testing Strategies by Layer

### 3.1 Unit Tests (No Docker Required)
```bash
# Run directly on host
cd server
pytest tests/unit -v

cd client
npm test -- tests/unit
```

### 3.2 Integration Tests (Docker Compose)
```bash
# Start dependencies
docker-compose -f docker-compose.test.yml up -d test-db redis

# Run tests
docker-compose -f docker-compose.test.yml run test-server pytest tests/integration

# Cleanup
docker-compose -f docker-compose.test.yml down -v
```

### 3.3 E2E Tests (Full Stack)
```bash
# Start entire stack
docker-compose -f docker-compose.dev.yml up -d

# Wait for services
./scripts/wait-for-services.sh

# Run E2E tests (Playwright/Cypress)
docker-compose -f docker-compose.dev.yml exec client npm run test:e2e

# Cleanup
docker-compose -f docker-compose.dev.yml down -v
```

---

## 4. Database Testing Patterns

### 4.1 Test Data Fixtures

Create `server/tests/fixtures/factories.py`:
```python
import factory
from factory import fuzzy
from src.features.topics.models import TopicChain, Topic
from src.features.projects.models import Project

class TopicChainFactory(factory.Factory):
    class Meta:
        model = TopicChain

    topic_path = fuzzy.FuzzyText(prefix="Topic > ")
    public_id = factory.Sequence(lambda n: f"chain-{n}")

class TopicFactory(factory.Factory):
    class Meta:
        model = Topic

    title = fuzzy.FuzzyText()
    description = fuzzy.FuzzyText(length=100)
    difficulty = fuzzy.FuzzyChoice(["beginner", "intermediate", "advanced"])
```

**Usage in tests**:
```python
async def test_with_factory_data(test_session):
    # Create test data
    topic_chain = TopicChainFactory()
    test_session.add(topic_chain)
    await test_session.commit()

    # Run test
    result = await some_service.get_topic_chain(topic_chain.public_id)
    assert result is not None
```

### 4.2 Database Seeding for Development

Create `server/src/db/seed.py`:
```python
import asyncio
from src.db.config import db_session
from tests.fixtures.factories import TopicChainFactory, TopicFactory

async def seed_database():
    """Seed database with test data for development"""
    async with db_session() as session:
        # Create sample topic chains
        for i in range(10):
            topic_chain = TopicChainFactory()
            session.add(topic_chain)

            # Add topics to chain
            for j in range(5):
                topic = TopicFactory()
                topic.topic_chain_id = topic_chain.id
                session.add(topic)

        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed_database())
```

**Run seeding in Docker**:
```bash
docker-compose exec server python -m src.db.seed
```

---

## 5. Testing Best Practices with Docker

### 5.1 Fast Feedback Loop

**Use layer caching**:
```dockerfile
# Dockerfile.test
FROM python:3.11-slim

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy code (changes frequently)
COPY . /app
WORKDIR /app

CMD ["pytest"]
```

**Watch mode for development**:
```bash
# Terminal 1: Start dependencies
docker-compose -f docker-compose.dev.yml up db redis

# Terminal 2: Run tests in watch mode
docker-compose -f docker-compose.dev.yml exec server \
  pytest-watch tests/ -- -v
```

### 5.2 Parallel Testing

```bash
# Run tests in parallel
docker-compose -f docker-compose.test.yml run test-server \
  pytest -n auto tests/

# Run specific markers
docker-compose -f docker-compose.test.yml run test-server \
  pytest -m "not slow" tests/
```

### 5.3 Test Isolation

**Ensure each test is independent**:
```python
@pytest.fixture(autouse=True)
async def cleanup_database(test_session):
    """Clean database after each test"""
    yield
    # Cleanup
    await test_session.rollback()
    for table in reversed(Base.metadata.sorted_tables):
        await test_session.execute(table.delete())
    await test_session.commit()
```

---

## 6. Debugging Tests in Docker

### 6.1 Interactive Debugging

**Attach debugger to container**:
```bash
# Start container with debugger port
docker-compose -f docker-compose.dev.yml run \
  --service-ports \
  -e PYTHONBREAKPOINT=ipdb.set_trace \
  server pytest tests/integration/test_topics.py
```

**VS Code launch configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Remote Attach",
      "type": "python",
      "request": "attach",
      "connect": {
        "host": "localhost",
        "port": 5678
      },
      "pathMappings": [
        {
          "localRoot": "${workspaceFolder}/server",
          "remoteRoot": "/app"
        }
      ]
    }
  ]
}
```

### 6.2 Log Inspection

```bash
# View test logs
docker-compose -f docker-compose.test.yml logs -f test-server

# Stream logs during test run
docker-compose -f docker-compose.test.yml run test-server \
  pytest tests/ -v --log-cli-level=DEBUG
```

---

## 7. Performance Testing in Docker

### 7.1 Load Testing

Install locust:
```bash
pip install locust
```

Create `server/tests/load/locustfile.py`:
```python
from locust import HttpUser, task, between

class ProgChainUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def generate_topics(self):
        self.client.post("/topics/generate", json={
            "topic_path": "Python",
            "topic_chain_id": "test-123",
            "conversation_id": "conv-456",
            "model": "gpt-4"
        })
```

**Run load tests**:
```bash
# Start application
docker-compose -f docker-compose.dev.yml up -d

# Run load test from host
locust -f server/tests/load/locustfile.py \
  --host=http://localhost:8000 \
  --users 100 \
  --spawn-rate 10
```

---

## 8. Complete Testing Workflow

### Daily Development Workflow

```bash
# 1. Start development environment
docker-compose -f docker-compose.dev.yml up -d

# 2. Run unit tests (fast)
docker-compose -f docker-compose.dev.yml exec server \
  pytest tests/unit -v

# 3. Run integration tests
docker-compose -f docker-compose.dev.yml exec server \
  pytest tests/integration -v

# 4. Frontend tests
docker-compose -f docker-compose.dev.yml exec client \
  npm test

# 5. Check coverage
docker-compose -f docker-compose.dev.yml exec server \
  pytest --cov=src --cov-report=html

# 6. View coverage report
open server/htmlcov/index.html
```

### Pre-Commit Workflow

```bash
# Run all checks
./scripts/pre-commit.sh

# Which includes:
# - Linting (black, ruff, eslint)
# - Type checking (mypy, tsc)
# - Unit tests
# - Security checks
```

### CI Workflow (Automated)

```yaml
# .github/workflows/test.yml
1. Checkout code
2. Set up Python/Node
3. Install dependencies
4. Run linting
5. Run unit tests
6. Build Docker images
7. Run integration tests with docker-compose
8. Upload coverage reports
9. Security scanning
```

---

## Summary

Testing in Docker environments follows these principles:

1. **Unit Tests**: Run directly, no Docker needed (fast feedback)
2. **Integration Tests**: Use docker-compose with separate test database
3. **E2E Tests**: Full stack with docker-compose
4. **CI/CD**: GitHub Actions with service containers
5. **Database**: Use tmpfs or in-memory SQLite for speed
6. **Isolation**: Fresh database per test or test suite
7. **Debugging**: Attach to running containers or use logs
8. **Performance**: Separate load testing environment

**Key Commands Reference**:
```bash
# Quick test (no Docker)
pytest tests/unit

# Full test with Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Watch mode
docker-compose exec server pytest-watch

# Debug specific test
docker-compose exec server pytest tests/unit/test_foo.py -vv -s

# Coverage
docker-compose exec server pytest --cov=src --cov-report=html
```
