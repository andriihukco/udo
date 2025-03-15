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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  print_error "Please run as root or with sudo"
  exit 1
fi

# Print header
echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}   Setting up Nginx Reverse Proxy        ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
  print_warning "Nginx is not installed. Installing Nginx..."
  
  # Check OS and install Nginx accordingly
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command -v brew &> /dev/null; then
      brew install nginx
    else
      print_error "Homebrew is not installed. Please install Nginx manually."
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v apt &> /dev/null; then
      apt update
      apt install -y nginx
    elif command -v yum &> /dev/null; then
      yum install -y nginx
    else
      print_error "Unsupported package manager. Please install Nginx manually."
      exit 1
    fi
  else
    print_error "Unsupported OS. Please install Nginx manually."
    exit 1
  fi
  
  if ! command -v nginx &> /dev/null; then
    print_error "Failed to install Nginx. Please install it manually."
    exit 1
  fi
fi

# Check if Next.js server is running
print_step "Checking if Next.js server is running..."

# First, try to read from the .next-port file
if [ -f ".next-port" ]; then
  NEXT_PORT=$(cat .next-port 2>/dev/null)
  if [ ! -z "$NEXT_PORT" ] && nc -z localhost $NEXT_PORT 2>/dev/null; then
    print_message "Found Next.js server running on port $NEXT_PORT (from .next-port file)."
  else
    print_warning ".next-port file exists but port $NEXT_PORT is not active."
    NEXT_PORT=""
  fi
fi

# If port is still not found, try to detect it from running processes
if [ -z "$NEXT_PORT" ]; then
  # Try different patterns to find the Next.js server port
  NEXT_PORT=$(ps aux | grep "next dev" | grep -v grep | grep -o "localhost:[0-9]*" | cut -d':' -f2 || echo "")
  
  if [ -z "$NEXT_PORT" ]; then
    # Try to find port from the network output
    NEXT_PORT=$(ps aux | grep "next" | grep -v grep | grep -o "http://localhost:[0-9]*" | cut -d':' -f3 || echo "")
  fi
  
  if [ -z "$NEXT_PORT" ]; then
    # Try to find port from lsof
    if command -v lsof &> /dev/null; then
      NEXT_PORT=$(lsof -i -P -n | grep node | grep LISTEN | grep -o "localhost:[0-9]*" | cut -d':' -f2 | head -1 || echo "")
    fi
  fi
  
  if [ ! -z "$NEXT_PORT" ]; then
    print_message "Found Next.js server running on port $NEXT_PORT."
  fi
fi

# If port is still not found, check common Next.js ports
if [ -z "$NEXT_PORT" ]; then
  print_warning "Could not detect Next.js server port from processes. Checking common ports..."
  
  for port in 3000 3001 3002 3003 3004 3005; do
    if nc -z localhost $port 2>/dev/null; then
      NEXT_PORT=$port
      print_message "Found a server running on port $NEXT_PORT."
      break
    fi
  done
fi

# If we still don't have a port, ask the user
if [ -z "$NEXT_PORT" ]; then
  print_warning "Could not automatically determine the Next.js server port."
  read -p "Please enter the port your Next.js server is running on (default: 3000): " USER_PORT
  
  if [ -z "$USER_PORT" ]; then
    NEXT_PORT=3000
  else
    NEXT_PORT=$USER_PORT
  fi
  
  # Verify the port is active
  if ! nc -z localhost $NEXT_PORT 2>/dev/null; then
    print_warning "No server detected on port $NEXT_PORT. Proceeding anyway..."
  else
    print_message "Confirmed server is running on port $NEXT_PORT."
  fi
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

# Create Nginx configuration
print_step "Creating Nginx configuration..."

# Ask for domain name
read -p "Enter your domain name (or leave blank for localhost): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
  DOMAIN_NAME="localhost"
fi

# Create Nginx configuration file
NGINX_CONF_DIR=""
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  NGINX_CONF_DIR="/usr/local/etc/nginx/servers"
  mkdir -p "$NGINX_CONF_DIR"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  NGINX_CONF_DIR="/etc/nginx/sites-available"
fi

NGINX_CONF_FILE="$NGINX_CONF_DIR/nextjs-proxy.conf"

cat > "$NGINX_CONF_FILE" << EOL
server {
    listen 80;
    server_name $DOMAIN_NAME;

    access_log /var/log/nginx/nextjs_access.log;
    error_log /var/log/nginx/nextjs_error.log;

    location / {
        proxy_pass http://localhost:$NEXT_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

print_message "Nginx configuration created at $NGINX_CONF_FILE"

# Enable the site (Linux only)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  print_step "Enabling the site..."
  ln -sf "$NGINX_CONF_DIR/nextjs-proxy.conf" /etc/nginx/sites-enabled/
fi

# Test Nginx configuration
print_step "Testing Nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
  print_error "Nginx configuration test failed"
  exit 1
fi

# Restart Nginx
print_step "Restarting Nginx..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  brew services restart nginx
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  systemctl restart nginx
fi

if [ $? -ne 0 ]; then
  print_error "Failed to restart Nginx"
  exit 1
fi

# Print success message
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Nginx Reverse Proxy is set up!       ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Your Next.js application is now accessible at:"
echo -e "${YELLOW}http://$DOMAIN_NAME${NC}"
echo ""
echo -e "Local Network URL: ${YELLOW}http://$LOCAL_IP${NC}"
echo ""
echo -e "If you're using a custom domain, make sure to update your hosts file or DNS settings."
echo -e "For local testing, add this line to your /etc/hosts file:"
echo -e "${BLUE}127.0.0.1 $DOMAIN_NAME${NC}"
echo "" 