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

# Check if .env.prod exists
if [ ! -f "environments/prod/.env.prod" ]; then
  print_error "Production environment file not found. Please create environments/prod/.env.prod from the example file."
  print_message "You can copy the example file with: cp environments/prod/.env.prod.example environments/prod/.env.prod"
  exit 1
fi

# Ask for domain name
read -p "Enter your production domain name (e.g., example.com): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
  print_error "Domain name cannot be empty."
  exit 1
fi

# Update domain in nginx.conf
print_message "Updating domain in nginx.prod.conf..."
sed -i "s/yourdomain.com/$DOMAIN_NAME/g" environments/prod/nginx.prod.conf
sed -i "s/www.yourdomain.com/www.$DOMAIN_NAME/g" environments/prod/nginx.prod.conf

# Update NEXTAUTH_URL in .env.prod
print_message "Updating NEXTAUTH_URL in .env.prod..."
sed -i "s|https://yourdomain.com|https://$DOMAIN_NAME|g" environments/prod/.env.prod

# Copy environment variables
print_message "Setting up production environment..."
cp environments/prod/.env.prod .env.local

# Create directories for certbot
print_message "Creating directories for SSL certificates..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./ssl
mkdir -p ./mongodb_backups

# Build and start production environment
print_message "Building and starting production environment..."
docker-compose -f environments/prod/docker-compose.prod.yml up -d --build

# Wait for services to start
print_message "Waiting for services to start..."
sleep 10

# Ask if user wants to obtain SSL certificate now
read -p "Do you want to obtain SSL certificate now? (y/n): " GET_SSL
if [ "$GET_SSL" = "y" ] || [ "$GET_SSL" = "Y" ]; then
  print_message "Obtaining SSL certificate from Let's Encrypt..."
  docker-compose -f environments/prod/docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN_NAME --agree-tos --no-eff-email \
    -d $DOMAIN_NAME -d www.$DOMAIN_NAME
  
  # Restart nginx to apply SSL
  docker-compose -f environments/prod/docker-compose.prod.yml restart nginx
  
  print_message "SSL certificate obtained successfully!"
else
  print_warning "Skipping SSL certificate acquisition. You can run this script again later to obtain SSL."
  print_warning "For now, the application will run without HTTPS."
  
  # Modify nginx.conf to work without SSL temporarily
  print_message "Updating nginx.conf for HTTP-only operation..."
  sed -i 's/return 301 https:\/\/$host$request_uri;/proxy_pass http:\/\/nextjs:3000;/g' environments/prod/nginx.prod.conf
  sed -i 's/listen 443 ssl http2;/#listen 443 ssl http2;/g' environments/prod/nginx.prod.conf
  sed -i 's/server_name yourdomain.com www.yourdomain.com;/#server_name yourdomain.com www.yourdomain.com;/g' environments/prod/nginx.prod.conf
  sed -i 's/ssl_certificate/#ssl_certificate/g' environments/prod/nginx.prod.conf
  sed -i 's/ssl_certificate_key/#ssl_certificate_key/g' environments/prod/nginx.prod.conf
  
  # Restart nginx to apply changes
  docker-compose -f environments/prod/docker-compose.prod.yml restart nginx
fi

# Seed the admin user
print_message "Seeding the admin user..."
docker-compose -f environments/prod/docker-compose.prod.yml exec nextjs npm run seed-admin

print_message "Production environment is running!"
print_message "Your application is now running at http://$DOMAIN_NAME"
if [ "$GET_SSL" = "y" ] || [ "$GET_SSL" = "Y" ]; then
  print_message "Your application is also available securely at https://$DOMAIN_NAME"
fi

print_message "To view logs, run: docker-compose -f environments/prod/docker-compose.prod.yml logs -f"
print_message "To stop the environment, run: docker-compose -f environments/prod/docker-compose.prod.yml down" 