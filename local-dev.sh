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

# Function to save port to file
save_port() {
  local port=$1
  echo $port > .next-port
  chmod 644 .next-port
  print_message "Saved port $port to .next-port file"
}

# Function to cleanup on exit
cleanup() {
  print_message "Cleaning up..."
  # Keep the port file for a minute to allow other scripts to use it
  # It will be removed by a background process
  (sleep 60 && rm -f .next-port) &
  exit 0
}

# Set up trap to catch exit
trap cleanup EXIT INT TERM

# Print header
echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}   Starting U:DO Shop Locally           ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed. Please install Node.js and try again."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  print_error "npm is not installed. Please install npm and try again."
  exit 1
fi

# Get local IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  LOCAL_IP=$(hostname -I | awk '{print $1}' || echo "127.0.0.1")
else
  # Default to localhost if OS not recognized
  LOCAL_IP="127.0.0.1"
fi

# Check if .env file exists
if [ ! -f .env ]; then
  print_warning ".env file not found. Creating a default one..."
  cat > .env << EOL
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/druk?authSource=admin
REDIS_URI=redis://localhost:6379
EOL
  print_message "Created default .env file."
fi

# Check if MongoDB is running via Docker
print_step "Checking if MongoDB is running..."
MONGODB_RUNNING=$(docker ps | grep druk-mongodb || echo "")

if [ -z "$MONGODB_RUNNING" ]; then
  print_warning "MongoDB container is not running. Starting MongoDB and Redis..."
  docker-compose up -d mongodb redis mongo-express
  
  if [ $? -ne 0 ]; then
    print_error "Failed to start MongoDB and Redis. Please start them manually."
    exit 1
  fi
  
  print_message "Waiting for MongoDB to be ready..."
  sleep 5
else
  print_message "MongoDB is already running."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  print_step "Installing dependencies..."
  npm install
  
  if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies."
    exit 1
  fi
fi

# Check if ports 3000-3005 are in use
PORT=3000
for p in {3000..3005}; do
  if ! nc -z localhost $p 2>/dev/null; then
    PORT=$p
    break
  fi
done

# Save the port to a file for other scripts to use
save_port $PORT

# Start the development server
print_step "Starting development server..."
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   U:DO Shop is now starting!           ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Local URL:            ${YELLOW}http://localhost:$PORT${NC}"
echo -e "Network URL:          ${YELLOW}http://${LOCAL_IP}:$PORT${NC}"
echo -e "MongoDB Express UI:   ${YELLOW}http://localhost:8081${NC}"
echo ""
echo -e "Press ${BLUE}Ctrl+C${NC} to stop the server"
echo ""

# Start the development server on the specific port
PORT=$PORT npm run dev

# This will be caught by the cleanup trap 