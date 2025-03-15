#!/bin/bash

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Ask for domain name
read -p "Enter your test domain name (default: test.yourdomain.com): " DOMAIN_NAME
DOMAIN_NAME=${DOMAIN_NAME:-test.yourdomain.com}

# Update domain in nginx.conf
print_message "Updating domain in nginx.test.conf..."
sed -i "s/test.yourdomain.com/$DOMAIN_NAME/g" environments/test/nginx.test.conf

# Update NEXTAUTH_URL in .env.test
print_message "Updating NEXTAUTH_URL in .env.test..."
sed -i "s|http://test.yourdomain.com|http://$DOMAIN_NAME|g" environments/test/docker-compose.test.yml
sed -i "s|http://test.yourdomain.com|http://$DOMAIN_NAME|g" environments/test/.env.test

# Copy environment variables
print_message "Setting up testing environment..."
cp environments/test/.env.test .env.local

# Build and start testing environment
print_message "Building and starting testing environment..."
docker-compose -f environments/test/docker-compose.test.yml up -d --build

# Wait for services to start
print_message "Waiting for services to start..."
sleep 10

# Seed the admin user
print_message "Seeding the admin user..."
docker-compose -f environments/test/docker-compose.test.yml exec nextjs npm run seed-admin

print_message "Testing environment is running!"
print_message "Next.js is available at: http://$DOMAIN_NAME (port 8080)"

print_message "To view logs, run: docker-compose -f environments/test/docker-compose.test.yml logs -f"
print_message "To stop the environment, run: docker-compose -f environments/test/docker-compose.test.yml down" 