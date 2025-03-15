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

# Function to display help
show_help() {
  echo -e "${CYAN}U:DO Shop Development Utilities${NC}"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  dev         Start development server"
  echo "  build       Build the application"
  echo "  start       Start production server"
  echo "  lint        Run linter"
  echo "  test        Run tests"
  echo "  clean       Clean build artifacts"
  echo "  deps        Install dependencies"
  echo "  update      Update dependencies"
  echo "  help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 dev      # Start development server"
  echo "  $0 build    # Build the application"
  echo "  $0 lint     # Run linter"
  echo ""
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  print_error "Docker is not installed. Please install Docker first."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  print_error "Docker Compose is not installed. Please install Docker Compose first."
  exit 1
fi

# Copy environment variables
print_message "Setting up development environment..."
cp environments/dev/.env.dev .env.local

# Start development environment
print_message "Starting development environment..."
docker-compose -f environments/dev/docker-compose.dev.yml up -d

# Wait for services to start
print_message "Waiting for services to start..."
sleep 5

# Seed the admin user
print_message "Seeding the admin user..."
docker-compose -f environments/dev/docker-compose.dev.yml exec nextjs npm run seed-admin

print_message "Development environment is running!"
print_message "Next.js is available at: http://localhost:3000"
print_message "MongoDB Express is available at: http://localhost:8081"

print_message "To view logs, run: docker-compose -f environments/dev/docker-compose.dev.yml logs -f"
print_message "To stop the environment, run: docker-compose -f environments/dev/docker-compose.dev.yml down"

# Start development server
start_dev() {
  print_step "Starting development server..."
  npm run dev
}

# Build the application
build_app() {
  print_step "Building the application..."
  npm run build
  
  if [ $? -eq 0 ]; then
    print_message "Build completed successfully."
  else
    print_error "Build failed."
  fi
}

# Start production server
start_prod() {
  print_step "Starting production server..."
  npm start
}

# Run linter
run_lint() {
  print_step "Running linter..."
  npm run lint
  
  if [ $? -eq 0 ]; then
    print_message "Linting completed successfully."
  else
    print_warning "Linting found issues."
  fi
}

# Run tests
run_tests() {
  print_step "Running tests..."
  
  if npm test; then
    print_message "Tests passed successfully."
  else
    print_error "Tests failed."
  fi
}

# Clean build artifacts
clean_artifacts() {
  print_step "Cleaning build artifacts..."
  
  print_message "Removing .next directory..."
  rm -rf .next
  
  print_message "Removing build directory..."
  rm -rf build
  
  print_message "Removing coverage directory..."
  rm -rf coverage
  
  print_message "Cleaning completed successfully."
}

# Install dependencies
install_deps() {
  print_step "Installing dependencies..."
  npm install
  
  if [ $? -eq 0 ]; then
    print_message "Dependencies installed successfully."
  else
    print_error "Failed to install dependencies."
  fi
}

# Update dependencies
update_deps() {
  print_step "Updating dependencies..."
  npm update
  
  if [ $? -eq 0 ]; then
    print_message "Dependencies updated successfully."
  else
    print_error "Failed to update dependencies."
  fi
}

# Main function
main() {
  # Check if command is provided
  if [ $# -eq 0 ]; then
    show_help
    exit 0
  fi
  
  # Parse command
  COMMAND=$1
  shift
  
  case $COMMAND in
    dev)
      start_dev
      ;;
    build)
      build_app
      ;;
    start)
      start_prod
      ;;
    lint)
      run_lint
      ;;
    test)
      run_tests
      ;;
    clean)
      clean_artifacts
      ;;
    deps)
      install_deps
      ;;
    update)
      update_deps
      ;;
    help)
      show_help
      ;;
    *)
      print_error "Unknown command: $COMMAND"
      show_help
      exit 1
      ;;
  esac
}

# Run main function with all arguments
main "$@" 