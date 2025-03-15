#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print header
echo ""
echo -e "${CYAN}=========================================${NC}"
echo -e "${CYAN}   Expose U:DO Shop to the Internet      ${NC}"
echo -e "${CYAN}=========================================${NC}"
echo ""
echo -e "Choose an option to expose your local Next.js server:"
echo -e ""
echo -e "${YELLOW}1)${NC} Use ngrok (temporary public URL, no setup required)"
echo -e "${YELLOW}2)${NC} Use Nginx (permanent setup, requires root access)"
echo -e "${YELLOW}q)${NC} Quit"
echo -e ""
read -p "Enter your choice [1/2/q]: " choice

case $choice in
  1)
    echo -e "Starting ngrok..."
    ./expose.sh
    ;;
  2)
    echo -e "Setting up Nginx reverse proxy..."
    sudo ./nginx-proxy.sh
    ;;
  q|Q)
    echo -e "Exiting..."
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid choice. Exiting...${NC}"
    exit 1
    ;;
esac 