#!/bin/bash

# Colors for output
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  print_error "Please run as root or with sudo"
  exit 1
fi

# Get the absolute path of the project directory
PROJECT_DIR=$(pwd)
print_message "Project directory: $PROJECT_DIR"

# Check if Next.js is built
if [ ! -d "$PROJECT_DIR/.next" ]; then
  print_warning "Next.js build directory not found. Building the application..."
  npm run build
  
  if [ $? -ne 0 ]; then
    print_error "Failed to build Next.js application"
    exit 1
  fi
fi

# Update Nginx configuration with actual paths
print_message "Updating Nginx configuration with actual paths..."
sed -i "s|/path/to/your/nextjs/app|$PROJECT_DIR|g" nginx-standalone.conf

# Ask for domain name
read -p "Enter your domain name (or leave blank for localhost): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
  DOMAIN_NAME="localhost"
fi
sed -i "s|server_name localhost;|server_name $DOMAIN_NAME;|g" nginx-standalone.conf

# Copy Nginx configuration
print_message "Copying Nginx configuration..."
cp nginx-standalone.conf /etc/nginx/sites-available/nextjs

# Create symbolic link if it doesn't exist
if [ ! -f /etc/nginx/sites-enabled/nextjs ]; then
  print_message "Creating symbolic link..."
  ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
fi

# Test Nginx configuration
print_message "Testing Nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
  print_error "Nginx configuration test failed"
  exit 1
fi

# Restart Nginx
print_message "Restarting Nginx..."
systemctl restart nginx

if [ $? -ne 0 ]; then
  print_error "Failed to restart Nginx"
  exit 1
fi

# Ask if user wants to set up SSL
read -p "Do you want to set up SSL with Let's Encrypt? (y/n): " SETUP_SSL
if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
  if [ "$DOMAIN_NAME" = "localhost" ]; then
    print_error "Cannot set up SSL for localhost. Please specify a domain name."
  else
    print_message "Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
    
    print_message "Obtaining SSL certificate..."
    certbot --nginx -d $DOMAIN_NAME
    
    if [ $? -ne 0 ]; then
      print_error "Failed to obtain SSL certificate"
      exit 1
    fi
    
    print_message "SSL setup complete!"
  fi
fi

# Ask if user wants to set up PM2
read -p "Do you want to set up PM2 for process management? (y/n): " SETUP_PM2
if [ "$SETUP_PM2" = "y" ] || [ "$SETUP_PM2" = "Y" ]; then
  # Check if PM2 is installed
  if ! command -v pm2 &> /dev/null; then
    print_message "Installing PM2..."
    npm install -g pm2
  fi
  
  print_message "Starting Next.js application with PM2..."
  cd $PROJECT_DIR
  pm2 start npm --name "nextjs-app" -- start
  
  print_message "Setting up PM2 to start on system boot..."
  pm2 startup
  pm2 save
  
  print_message "PM2 setup complete!"
fi

print_message "Deployment complete! Your Next.js application should now be accessible at http://$DOMAIN_NAME"
if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
  if [ "$DOMAIN_NAME" != "localhost" ]; then
    print_message "Or securely at https://$DOMAIN_NAME"
  fi
fi 