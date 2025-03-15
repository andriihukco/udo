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
echo -e "${CYAN}   Exposing U:DO Shop to the Internet   ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
  print_warning "ngrok is not installed. Installing ngrok..."
  
  # Check OS and install ngrok accordingly
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command -v brew &> /dev/null; then
      brew install ngrok
    else
      print_error "Homebrew is not installed. Please install ngrok manually: https://ngrok.com/download"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v snap &> /dev/null; then
      sudo snap install ngrok
    else
      print_error "Snap is not installed. Please install ngrok manually: https://ngrok.com/download"
      exit 1
    fi
  else
    print_error "Unsupported OS. Please install ngrok manually: https://ngrok.com/download"
    exit 1
  fi
  
  if ! command -v ngrok &> /dev/null; then
    print_error "Failed to install ngrok. Please install it manually: https://ngrok.com/download"
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

# If port is still not found, try to start the Next.js server
if [ -z "$NEXT_PORT" ]; then
  print_warning "Next.js server is not running. Attempting to start it..."
  
  # Start the server in the background
  ./local-dev.sh &
  SERVER_PID=$!
  
  # Wait for the server to start
  print_message "Waiting for Next.js server to start (10 seconds)..."
  sleep 10
  
  # Try to read from the .next-port file again
  if [ -f ".next-port" ]; then
    NEXT_PORT=$(cat .next-port 2>/dev/null)
    if [ ! -z "$NEXT_PORT" ] && nc -z localhost $NEXT_PORT 2>/dev/null; then
      print_message "Next.js server started on port $NEXT_PORT."
    else
      print_warning ".next-port file exists but port $NEXT_PORT is not active."
      NEXT_PORT=""
    fi
  fi
  
  # If port is still not found, check common ports again
  if [ -z "$NEXT_PORT" ]; then
    for port in 3000 3001 3002 3003 3004 3005; do
      if nc -z localhost $port 2>/dev/null; then
        NEXT_PORT=$port
        print_message "Found Next.js server running on port $NEXT_PORT."
        break
      fi
    done
  fi
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

# Start ngrok
print_step "Starting ngrok to expose port $NEXT_PORT..."
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   ngrok is starting...                 ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Your Next.js application will be accessible at the URL displayed below."
echo -e "Look for a line like: ${YELLOW}Forwarding https://xxxx-xxx-xxx-xxx-xxx.ngrok.io -> http://localhost:$NEXT_PORT${NC}"
echo ""
echo -e "Press ${BLUE}Ctrl+C${NC} to stop ngrok"
echo ""

# Start ngrok
ngrok http $NEXT_PORT 