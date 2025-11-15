#!/bin/bash

set -e

echo "🔍 Running linters for ProgChain..."
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Backend linting
echo -e "${YELLOW}🐍 Linting backend code...${NC}"

cd server

# Check if running in Docker or locally
if command -v docker-compose &> /dev/null; then
    echo "Running linters in Docker..."

    # Black (formatting check)
    echo -e "${YELLOW}Running Black...${NC}"
    docker-compose -f ../docker-compose.dev.yml exec -T server black --check src/ || {
        echo -e "${RED}❌ Black formatting issues found. Run: docker-compose exec server black src/${NC}"
        BACKEND_LINT_FAILED=1
    }

    # Ruff (linting)
    echo -e "${YELLOW}Running Ruff...${NC}"
    docker-compose -f ../docker-compose.dev.yml exec -T server ruff check src/ || {
        echo -e "${RED}❌ Ruff linting issues found${NC}"
        BACKEND_LINT_FAILED=1
    }
else
    # Running locally
    if command -v black &> /dev/null; then
        echo -e "${YELLOW}Running Black...${NC}"
        black --check src/ || BACKEND_LINT_FAILED=1
    fi

    if command -v ruff &> /dev/null; then
        echo -e "${YELLOW}Running Ruff...${NC}"
        ruff check src/ || BACKEND_LINT_FAILED=1
    fi
fi

cd ..

# Frontend linting
echo ""
echo -e "${YELLOW}⚛️  Linting frontend code...${NC}"

cd client

if command -v docker-compose &> /dev/null; then
    echo "Running ESLint in Docker..."
    docker-compose -f ../docker-compose.dev.yml exec -T client npm run lint || {
        echo -e "${RED}❌ ESLint issues found${NC}"
        FRONTEND_LINT_FAILED=1
    }
else
    if command -v npm &> /dev/null; then
        npm run lint || FRONTEND_LINT_FAILED=1
    fi
fi

cd ..

# Summary
echo ""
echo "================================"
echo "Linting Summary"
echo "================================"

if [ -z "$BACKEND_LINT_FAILED" ]; then
    echo -e "Backend:  ${GREEN}✅ PASSED${NC}"
else
    echo -e "Backend:  ${RED}❌ FAILED${NC}"
fi

if [ -z "$FRONTEND_LINT_FAILED" ]; then
    echo -e "Frontend: ${GREEN}✅ PASSED${NC}"
else
    echo -e "Frontend: ${RED}❌ FAILED${NC}"
fi
echo "================================"

if [ -n "$BACKEND_LINT_FAILED" ] || [ -n "$FRONTEND_LINT_FAILED" ]; then
    exit 1
fi

echo -e "${GREEN}✅ All linting checks passed!${NC}"
