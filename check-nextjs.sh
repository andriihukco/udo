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
echo -e "${CYAN}   Checking Next.js Server Status        ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""

# First, try to read from the .next-port file
if [ -f ".next-port" ]; then
  NEXT_PORT=$(cat .next-port 2>/dev/null)
  if [ ! -z "$NEXT_PORT" ] && nc -z localhost $NEXT_PORT 2>/dev/null; then
    print_message "Found Next.js server running on port $NEXT_PORT (from .next-port file)."
    FOUND_SERVER=true
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
    FOUND_SERVER=true
  fi
fi

# If port is still not found, check common Next.js ports
if [ -z "$NEXT_PORT" ]; then
  print_warning "Could not detect Next.js server port from processes. Checking common ports..."
  
  for port in 3000 3001 3002 3003 3004 3005; do
    if nc -z localhost $port 2>/dev/null; then
      NEXT_PORT=$port
      print_message "Found a server running on port $NEXT_PORT."
      FOUND_SERVER=true
      break
    fi
  done
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

# Display server status
if [ "$FOUND_SERVER" = true ]; then
  echo ""
  echo -e "${GREEN}=========================================${NC}"
  echo -e "${GREEN}   Next.js Server is RUNNING!           ${NC}"
  echo -e "${GREEN}=========================================${NC}"
  echo ""
  echo -e "Local URL:            ${YELLOW}http://localhost:$NEXT_PORT${NC}"
  echo -e "Network URL:          ${YELLOW}http://${LOCAL_IP}:$NEXT_PORT${NC}"
  echo -e "MongoDB Express UI:   ${YELLOW}http://localhost:8081${NC}"
  echo ""
  echo -e "To expose this server to the internet, run:"
  echo -e "  ${BLUE}./expose-options.sh${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}=========================================${NC}"
  echo -e "${RED}   Next.js Server is NOT RUNNING!       ${NC}"
  echo -e "${RED}=========================================${NC}"
  echo ""
  echo -e "To start the Next.js server, run:"
  echo -e "  ${BLUE}./local-dev.sh${NC}"
  echo ""
fi 