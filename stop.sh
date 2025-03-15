#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
  echo -e "${BLUE}[STEP]${NC} $1"
}

# Print header
echo ""
echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}   Stopping U:DO Shop                   ${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo ""

# Check if Docker is running
print_step "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  print_error "Docker is not running. Cannot stop containers."
  exit 1
fi
print_message "Docker is running."

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
  print_error "docker-compose.yml not found. Are you in the correct directory?"
  exit 1
fi

# Stop the containers
print_step "Stopping containers..."
docker-compose down

# Check if containers were stopped successfully
if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${GREEN}   U:DO Shop has been stopped           ${NC}"
  echo -e "${GREEN}=========================================${NC}"
  echo ""
  echo -e "To start the application again, run: ${BLUE}./start.sh${NC}"
  echo ""
else
  print_error "Failed to stop the application. Try running: docker-compose down --remove-orphans"
fi

# Check if any containers are still running
RUNNING_CONTAINERS=$(docker ps --filter "name=druk-" -q)
if [ ! -z "$RUNNING_CONTAINERS" ]; then
  print_warning "Some containers may still be running. To force stop all containers, run:"
  echo -e "${BLUE}docker stop \$(docker ps --filter \"name=druk-\" -q)${NC}"
fi 