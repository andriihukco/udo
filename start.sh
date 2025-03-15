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

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Print header
echo ""
echo -e "${YELLOW}=========================================${NC}"
echo -e "${YELLOW}   Starting U:DO Shop with Docker       ${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo ""

# Check if Docker is installed
if ! command_exists docker; then
  print_error "Docker is not installed. Please install Docker and try again."
  echo -e "Visit ${BLUE}https://docs.docker.com/get-docker/${NC} for installation instructions."
  exit 1
fi

# Check if Docker Compose is installed
if ! command_exists docker-compose; then
  print_error "Docker Compose is not installed. Please install Docker Compose and try again."
  echo -e "Visit ${BLUE}https://docs.docker.com/compose/install/${NC} for installation instructions."
  exit 1
fi

# Check if Docker is running
print_step "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  print_error "Docker is not running. Please start Docker and try again."
  exit 1
fi
print_message "Docker is running."

# Check if ports are available
print_step "Checking if required ports are available..."
PORT_80_STATUS=$(netstat -tuln | grep ":80 " || echo "")
PORT_443_STATUS=$(netstat -tuln | grep ":443 " || echo "")
PORT_27017_STATUS=$(netstat -tuln | grep ":27017 " || echo "")
PORT_6379_STATUS=$(netstat -tuln | grep ":6379 " || echo "")
PORT_8081_STATUS=$(netstat -tuln | grep ":8081 " || echo "")

if [ ! -z "$PORT_80_STATUS" ]; then
  print_warning "Port 80 is already in use. Nginx might not start properly."
fi

if [ ! -z "$PORT_443_STATUS" ]; then
  print_warning "Port 443 is already in use. HTTPS might not work properly."
fi

if [ ! -z "$PORT_27017_STATUS" ]; then
  print_warning "Port 27017 is already in use. MongoDB might not start properly."
fi

if [ ! -z "$PORT_6379_STATUS" ]; then
  print_warning "Port 6379 is already in use. Redis might not start properly."
fi

if [ ! -z "$PORT_8081_STATUS" ]; then
  print_warning "Port 8081 is already in use. Mongo Express might not start properly."
fi

# Check if .env file exists
if [ ! -f .env ]; then
  print_warning ".env file not found. Creating a default one..."
  cat > .env << EOL
NODE_ENV=production
MONGODB_URI=mongodb://admin:password@mongodb:27017/druk?authSource=admin
REDIS_URI=redis://redis:6379
EOL
  print_message "Created default .env file."
fi

# Build and start the containers
print_step "Building and starting containers..."
docker-compose up -d --build

# Check if containers are running
if [ $? -eq 0 ]; then
  print_message "Waiting for services to be ready..."
  sleep 5
  
  # Check container status
  NEXTJS_STATUS=$(docker-compose ps -q nextjs)
  NGINX_STATUS=$(docker-compose ps -q nginx)
  MONGODB_STATUS=$(docker-compose ps -q mongodb)
  REDIS_STATUS=$(docker-compose ps -q redis)
  
  if [ -z "$NEXTJS_STATUS" ]; then
    print_warning "Next.js container is not running. Check logs with: docker-compose logs nextjs"
  fi
  
  if [ -z "$NGINX_STATUS" ]; then
    print_warning "Nginx container is not running. Check logs with: docker-compose logs nginx"
  fi
  
  if [ -z "$MONGODB_STATUS" ]; then
    print_warning "MongoDB container is not running. Check logs with: docker-compose logs mongodb"
  fi
  
  if [ -z "$REDIS_STATUS" ]; then
    print_warning "Redis container is not running. Check logs with: docker-compose logs redis"
  fi
  
  # Final status message
  echo ""
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${GREEN}   U:DO Shop is now running!            ${NC}"
  echo -e "${GREEN}=========================================${NC}"
  echo ""
  echo -e "Access the application at: ${YELLOW}http://localhost${NC}"
  echo -e "MongoDB Express UI: ${YELLOW}http://localhost:8081${NC}"
  echo ""
  echo -e "To view logs: ${BLUE}docker-compose logs -f${NC}"
  echo -e "To stop the application: ${BLUE}./stop.sh${NC}"
  echo ""
else
  print_error "Failed to start the application. Check the logs with: docker-compose logs"
fi 