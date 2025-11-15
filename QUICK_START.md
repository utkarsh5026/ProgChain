# Quick Start Guide - ProgChain Testing Setup

This guide will help you quickly set up testing for the ProgChain project.

## Prerequisites

- Docker and Docker Compose installed
- Python 3.11+
- Node.js 18+
- Git

## Step 1: Initial Setup (5 minutes)

### 1.1 Environment Variables

```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-actual-key-here
```

### 1.2 Install Dependencies Locally (Optional but Recommended)

For better IDE support:

```bash
# Backend
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Frontend
cd client
npm install
cd ..
```

## Step 2: Backend Testing Setup (10 minutes)

### 2.1 Create Test Structure

```bash
cd server
mkdir -p tests/{unit,integration,e2e,fixtures,mocks}
touch tests/__init__.py
```

### 2.2 Create pytest Configuration

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
```

### 2.3 Create Test Fixtures

Create `server/tests/conftest.py`:
```python
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from src.db.config import Base
from src.fastapi_components import fastapi_app as app

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def test_db():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture(scope="function")
async def test_session(test_db):
    TestSessionLocal = sessionmaker(
        test_db, class_=AsyncSession, expire_on_commit=False
    )
    async with TestSessionLocal() as session:
        yield session

@pytest.fixture(scope="function")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

### 2.4 Write Your First Test

Create `server/tests/unit/test_example.py`:
```python
import pytest

def test_simple():
    assert 1 + 1 == 2

@pytest.mark.asyncio
async def test_async_example():
    result = await some_async_function()
    assert result is not None
```

### 2.5 Run Tests

```bash
# Option 1: Run locally (if dependencies installed)
cd server
pytest

# Option 2: Run in Docker
cd ..
docker-compose -f docker-compose.test.yml run test-server

# Option 3: Run in dev environment
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml exec server pytest
```

## Step 3: Frontend Testing Setup (10 minutes)

### 3.1 Install Test Dependencies

```bash
cd client
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 3.2 Configure Vitest

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
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 3.3 Create Test Setup

Create `client/src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

### 3.4 Write Your First Component Test

Create `client/src/components/__tests__/example.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Example Test', () => {
  it('renders successfully', () => {
    render(<div>Hello World</div>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

### 3.5 Update package.json

Add to `client/package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 3.6 Run Tests

```bash
# Option 1: Run locally
npm test

# Option 2: Run in Docker
cd ..
docker-compose -f docker-compose.dev.yml exec client npm test
```

## Step 4: Complete Testing Workflow

### 4.1 Run All Tests

Create `scripts/test-all.sh`:
```bash
#!/bin/bash

echo "🧪 Running all tests..."

# Start test environment
docker-compose -f docker-compose.test.yml up -d test-db test-redis

# Wait for services
sleep 5

# Run backend tests
echo "🐍 Running backend tests..."
docker-compose -f docker-compose.test.yml run --rm test-server

# Run frontend tests
echo "⚛️ Running frontend tests..."
docker-compose -f docker-compose.dev.yml run --rm test-client

# Cleanup
docker-compose -f docker-compose.test.yml down -v

echo "✅ All tests completed!"
```

Make it executable:
```bash
chmod +x scripts/test-all.sh
```

Run it:
```bash
./scripts/test-all.sh
```

### 4.2 Development Workflow

```bash
# Terminal 1: Start development environment
docker-compose -f docker-compose.dev.yml up

# Terminal 2: Run tests in watch mode
docker-compose -f docker-compose.dev.yml exec server pytest-watch
# or
docker-compose -f docker-compose.dev.yml exec client npm test
```

## Step 5: CI/CD Setup (10 minutes)

### 5.1 Create GitHub Actions Workflow

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd server
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd server
          pytest --cov=src

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd client
          npm ci
      - name: Run tests
        run: |
          cd client
          npm test
```

## Common Commands Cheat Sheet

### Backend Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_topics.py

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test
pytest tests/unit/test_topics.py::test_create_topic

# Run in watch mode
pytest-watch

# Run in Docker
docker-compose -f docker-compose.dev.yml exec server pytest
```

### Frontend Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- example.test.tsx

# Run in Docker
docker-compose -f docker-compose.dev.yml exec client npm test
```

### Docker Commands

```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f server

# Exec into container
docker-compose -f docker-compose.dev.yml exec server bash

# Run tests in container
docker-compose -f docker-compose.dev.yml exec server pytest

# Clean up
docker-compose -f docker-compose.dev.yml down -v

# Rebuild
docker-compose -f docker-compose.dev.yml up --build
```

## Troubleshooting

### Issue: Tests fail with database errors

**Solution**: Ensure test database is clean
```bash
rm server/test.db
pytest
```

### Issue: Docker tests hang

**Solution**: Check if ports are available
```bash
docker-compose -f docker-compose.test.yml down -v
docker-compose -f docker-compose.test.yml up
```

### Issue: Import errors in tests

**Solution**: Set PYTHONPATH
```bash
export PYTHONPATH=/app/src
pytest
```

### Issue: Frontend tests fail with module not found

**Solution**: Clear cache and reinstall
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm test
```

## Next Steps

1. ✅ Complete Phase 1 of the roadmap (Testing Foundation)
2. ✅ Set up pre-commit hooks
3. ✅ Add more test cases
4. ✅ Set up CI/CD (Phase 2)
5. ✅ Implement database migrations (Phase 3)

Refer to `ROADMAP.md` for the complete development plan.

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)

## Getting Help

- Check `ROADMAP.md` for detailed implementation steps
- Review test examples in `tests/` directories
- Consult the official documentation for each tool
- Open an issue in the repository if you encounter problems
