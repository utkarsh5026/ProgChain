#!/bin/bash

set -e

echo "🚀 Setting up ProgChain development environment..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Create environment files
echo ""
echo -e "${YELLOW}Setting up environment files...${NC}"

if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo -e "${GREEN}✅ Created server/.env${NC}"
    echo "⚠️  Please edit server/.env and add your OPENAI_API_KEY"
else
    echo "ℹ️  server/.env already exists, skipping..."
fi

if [ ! -f client/.env ]; then
    cp client/.env.example client/.env
    echo -e "${GREEN}✅ Created client/.env${NC}"
else
    echo "ℹ️  client/.env already exists, skipping..."
fi

# Create test directories
echo ""
echo -e "${YELLOW}Creating test directory structure...${NC}"

mkdir -p server/tests/{unit,integration,e2e,fixtures,mocks}
touch server/tests/__init__.py
echo -e "${GREEN}✅ Created test directories${NC}"

# Create scripts directory
mkdir -p scripts
chmod +x scripts/*.sh 2>/dev/null || true

# Create logs directory
mkdir -p server/logs
echo -e "${GREEN}✅ Created logs directory${NC}"

# Create uploads directory
mkdir -p server/uploads
echo -e "${GREEN}✅ Created uploads directory${NC}"

# Build Docker images
echo ""
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose -f docker-compose.dev.yml build

echo ""
echo -e "${GREEN}✅ Development environment setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your OPENAI_API_KEY"
echo "2. Start the development environment:"
echo "   docker-compose -f docker-compose.dev.yml up"
echo "3. Access the application:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "To run tests:"
echo "   ./scripts/test-all.sh"
