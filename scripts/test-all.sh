#!/bin/bash

set -e

echo "🧪 Running all tests for ProgChain..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start test environment
echo -e "${YELLOW}Starting test environment...${NC}"
docker-compose -f docker-compose.test.yml up -d test-db test-redis

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Run backend tests
echo ""
echo -e "${YELLOW}🐍 Running backend tests...${NC}"
if docker-compose -f docker-compose.test.yml run --rm test-server; then
    echo -e "${GREEN}✅ Backend tests passed!${NC}"
    BACKEND_STATUS=0
else
    echo -e "${RED}❌ Backend tests failed!${NC}"
    BACKEND_STATUS=1
fi

# Run frontend tests
echo ""
echo -e "${YELLOW}⚛️  Running frontend tests...${NC}"
if docker-compose -f docker-compose.dev.yml up -d client; then
    sleep 5
    if docker-compose -f docker-compose.dev.yml exec -T client npm test -- --run; then
        echo -e "${GREEN}✅ Frontend tests passed!${NC}"
        FRONTEND_STATUS=0
    else
        echo -e "${RED}❌ Frontend tests failed!${NC}"
        FRONTEND_STATUS=1
    fi
else
    echo -e "${RED}❌ Could not start frontend service!${NC}"
    FRONTEND_STATUS=1
fi

# Cleanup
echo ""
echo -e "${YELLOW}Cleaning up...${NC}"
docker-compose -f docker-compose.test.yml down -v
docker-compose -f docker-compose.dev.yml down

# Summary
echo ""
echo "================================"
echo "Test Summary"
echo "================================"
if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "Backend:  ${GREEN}✅ PASSED${NC}"
else
    echo -e "Backend:  ${RED}❌ FAILED${NC}"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "Frontend: ${GREEN}✅ PASSED${NC}"
else
    echo -e "Frontend: ${RED}❌ FAILED${NC}"
fi
echo "================================"

# Exit with failure if any tests failed
if [ $BACKEND_STATUS -ne 0 ] || [ $FRONTEND_STATUS -ne 0 ]; then
    exit 1
fi

echo -e "${GREEN}✅ All tests completed successfully!${NC}"
