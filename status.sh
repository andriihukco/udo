#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}   U:DO Shop Status                     ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# Check if Docker is running
print_step "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  print_error "Docker is not running. Cannot check container status."
  exit 1
fi
print_message "Docker is running."

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
  print_error "docker-compose.yml not found. Are you in the correct directory?"
  exit 1
fi

# Get container status
print_step "Checking container status..."
echo ""
docker-compose ps
echo ""

# Check if specific containers are running
NEXTJS_RUNNING=$(docker-compose ps -q nextjs)
NGINX_RUNNING=$(docker-compose ps -q nginx)
MONGODB_RUNNING=$(docker-compose ps -q mongodb)
REDIS_RUNNING=$(docker-compose ps -q redis)
MONGO_EXPRESS_RUNNING=$(docker-compose ps -q mongo-express)

echo -e "${CYAN}Service Status:${NC}"
echo -e "-------------------------------------"

if [ -z "$NEXTJS_RUNNING" ]; then
  echo -e "Next.js:        ${RED}Not Running${NC}"
else
  echo -e "Next.js:        ${GREEN}Running${NC}"
fi

if [ -z "$NGINX_RUNNING" ]; then
  echo -e "Nginx:          ${RED}Not Running${NC}"
else
  echo -e "Nginx:          ${GREEN}Running${NC}"
fi

if [ -z "$MONGODB_RUNNING" ]; then
  echo -e "MongoDB:        ${RED}Not Running${NC}"
else
  echo -e "MongoDB:        ${GREEN}Running${NC}"
fi

if [ -z "$REDIS_RUNNING" ]; then
  echo -e "Redis:          ${RED}Not Running${NC}"
else
  echo -e "Redis:          ${GREEN}Running${NC}"
fi

if [ -z "$MONGO_EXPRESS_RUNNING" ]; then
  echo -e "Mongo Express:  ${RED}Not Running${NC}"
else
  echo -e "Mongo Express:  ${GREEN}Running${NC}"
fi

echo -e "-------------------------------------"
echo ""

# Check resource usage
print_step "Checking resource usage..."
echo ""
docker stats --no-stream $(docker-compose ps -q)
echo ""

# Check for any container logs with errors
print_step "Checking for errors in logs (last 10 lines)..."
echo ""

if [ ! -z "$NEXTJS_RUNNING" ]; then
  echo -e "${CYAN}Next.js Logs:${NC}"
  docker-compose logs --tail=10 nextjs | grep -i "error\|exception\|fatal" || echo "No errors found."
  echo ""
fi

if [ ! -z "$NGINX_RUNNING" ]; then
  echo -e "${CYAN}Nginx Logs:${NC}"
  docker-compose logs --tail=10 nginx | grep -i "error\|exception\|fatal" || echo "No errors found."
  echo ""
fi

if [ ! -z "$MONGODB_RUNNING" ]; then
  echo -e "${CYAN}MongoDB Logs:${NC}"
  docker-compose logs --tail=10 mongodb | grep -i "error\|exception\|fatal" || echo "No errors found."
  echo ""
fi

# Print helpful commands
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}   Helpful Commands                     ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""
echo -e "View all logs:               ${BLUE}docker-compose logs${NC}"
echo -e "View specific service logs:  ${BLUE}docker-compose logs [service]${NC}"
echo -e "Follow logs in real-time:    ${BLUE}docker-compose logs -f${NC}"
echo -e "Restart a service:           ${BLUE}docker-compose restart [service]${NC}"
echo -e "Start all services:          ${BLUE}./start.sh${NC}"
echo -e "Stop all services:           ${BLUE}./stop.sh${NC}"
echo "" 