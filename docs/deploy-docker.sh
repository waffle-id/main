#!/bin/bash

# Waffle Documentation Docker Deployment Script

set -e

echo "🧇 Deploying Waffle Documentation with Docker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &>/dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &>/dev/null && ! docker compose version &>/dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your domain and email before continuing."
    print_status "Press Enter to continue after editing .env, or Ctrl+C to cancel..."
    read -r
fi

# Parse command line arguments
ENVIRONMENT="production"
DETACHED=""
REBUILD=""

while [[ $# -gt 0 ]]; do
    case $1 in
    --dev | --development)
        ENVIRONMENT="development"
        shift
        ;;
    --prod | --production)
        ENVIRONMENT="production"
        shift
        ;;
    -d | --detach)
        DETACHED="-d"
        shift
        ;;
    --rebuild)
        REBUILD="--build"
        shift
        ;;
    -h | --help)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --dev, --development    Use development configuration"
        echo "  --prod, --production    Use production configuration (default)"
        echo "  -d, --detach           Run in detached mode"
        echo "  --rebuild              Rebuild Docker images"
        echo "  -h, --help             Show this help message"
        exit 0
        ;;
    *)
        print_error "Unknown option: $1"
        exit 1
        ;;
    esac
done

# Select docker-compose file based on environment
if [ "$ENVIRONMENT" = "development" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    print_status "Using development configuration"
else
    COMPOSE_FILE="docker-compose.yml"
    print_status "Using production configuration"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down 2>/dev/null || true

# Build and start containers
print_status "Building and starting containers..."
if command -v docker-compose &>/dev/null; then
    docker-compose -f $COMPOSE_FILE up $DETACHED $REBUILD
else
    docker compose -f $COMPOSE_FILE up $DETACHED $REBUILD
fi

if [ -n "$DETACHED" ]; then
    print_success "Documentation deployed successfully!"
    print_status "Container status:"
    docker ps --filter "name=waffle-docs"

    echo ""
    print_status "Access your documentation at:"
    if [ "$ENVIRONMENT" = "development" ]; then
        echo "  🌐 Local: http://localhost:3000"
    else
        echo "  🌐 Local: http://localhost:3000"
        echo "  🌐 Domain: https://$(grep DOMAIN .env 2>/dev/null | cut -d'=' -f2 || echo 'docs.waffle.food')"
    fi

    echo ""
    print_status "Useful commands:"
    echo "  📊 View logs: docker-compose -f $COMPOSE_FILE logs -f"
    echo "  🛑 Stop: docker-compose -f $COMPOSE_FILE down"
    echo "  🔄 Restart: docker-compose -f $COMPOSE_FILE restart"
    echo "  🧹 Clean: docker-compose -f $COMPOSE_FILE down -v --remove-orphans"
fi
