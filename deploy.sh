#!/bin/bash

# Deploy script for udo-druk Next.js application with MongoDB in Docker

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
read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
  print_error "Domain name cannot be empty."
  exit 1
fi

# Update domain in nginx.conf
print_message "Updating domain in nginx.conf..."
sed -i "s/yourdomain.com/$DOMAIN_NAME/g" nginx.conf
sed -i "s/www.yourdomain.com/www.$DOMAIN_NAME/g" nginx.conf

# Update NEXTAUTH_URL in docker-compose.yml
print_message "Updating NEXTAUTH_URL in docker-compose.yml..."
sed -i "s|https://yourdomain.com|https://$DOMAIN_NAME|g" docker-compose.yml

# Create directories for certbot
print_message "Creating directories for SSL certificates..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./ssl
mkdir -p ./mongodb_backups

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  print_message "Creating .env file..."
  cat > .env << EOL
# Database
MONGODB_URI=mongodb://admin:password@mongodb:27017/druk?authSource=admin

# NextAuth
NEXTAUTH_URL=https://$DOMAIN_NAME
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Redis
REDIS_URL=redis://redis:6379

# Default Superadmin User
DEFAULT_ADMIN_NAME=M
DEFAULT_ADMIN_ID=1
DEFAULT_ADMIN_ROLE=superadmin
DEFAULT_ADMIN_EMAIL=m@u-do.store
DEFAULT_ADMIN_PASSWORD=motherlord
EOL
fi

# Ask if user wants to obtain SSL certificate now
read -p "Do you want to obtain SSL certificate now? (y/n): " GET_SSL
if [ "$GET_SSL" = "y" ] || [ "$GET_SSL" = "Y" ]; then
  print_message "Starting Nginx for SSL certificate acquisition..."
  
  # Start nginx container for certificate acquisition
  docker-compose up -d nginx
  
  # Wait for nginx to start
  sleep 5
  
  # Get SSL certificate
  print_message "Obtaining SSL certificate from Let's Encrypt..."
  docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN_NAME --agree-tos --no-eff-email \
    -d $DOMAIN_NAME -d www.$DOMAIN_NAME
  
  # Restart nginx to apply SSL
  docker-compose restart nginx
  
  print_message "SSL certificate obtained successfully!"
else
  print_warning "Skipping SSL certificate acquisition. You can run this script again later to obtain SSL."
  print_warning "For now, the application will run without HTTPS."
  
  # Modify nginx.conf to work without SSL temporarily
  print_message "Updating nginx.conf for HTTP-only operation..."
  sed -i 's/return 301 https:\/\/$host$request_uri;/proxy_pass http:\/\/nextjs:3000;/g' nginx.conf
  sed -i 's/listen 443 ssl http2;/#listen 443 ssl http2;/g' nginx.conf
  sed -i 's/server_name yourdomain.com www.yourdomain.com;/#server_name yourdomain.com www.yourdomain.com;/g' nginx.conf
  sed -i 's/ssl_certificate/#ssl_certificate/g' nginx.conf
  sed -i 's/ssl_certificate_key/#ssl_certificate_key/g' nginx.conf
fi

# Start the application
print_message "Starting the application..."
docker-compose up -d

# Wait for services to start
sleep 10

# Seed the admin user
print_message "Seeding the admin user..."
docker-compose exec nextjs npm run seed-admin

print_message "Deployment completed successfully!"
print_message "Your application is now running at http://$DOMAIN_NAME"
if [ "$GET_SSL" = "y" ] || [ "$GET_SSL" = "Y" ]; then
  print_message "Your application is also available securely at https://$DOMAIN_NAME"
fi

print_message "MongoDB is running and accessible within the Docker network"
print_message "MongoDB Express admin interface is available at http://$DOMAIN_NAME:8081"
print_warning "For security, consider disabling MongoDB Express in production by commenting it out in docker-compose.yml"

echo ""
print_message "To check the status of your containers, run: docker-compose ps"
print_message "To view logs, run: docker-compose logs -f"
print_message "To stop the application, run: docker-compose down"
print_message "To restart the application, run: docker-compose restart" 