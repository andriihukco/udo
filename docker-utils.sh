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
  echo -e "${CYAN}U:DO Shop Docker Utilities${NC}"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  start       Start all containers"
  echo "  stop        Stop all containers"
  echo "  status      Show container status"
  echo "  restart     Restart all containers"
  echo "  logs        Show logs from all containers"
  echo "  clean       Remove unused Docker resources"
  echo "  rebuild     Rebuild and restart containers"
  echo "  shell       Open a shell in a container"
  echo "  backup      Backup MongoDB data"
  echo "  restore     Restore MongoDB data from backup"
  echo "  help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 logs nextjs    # Show logs for the nextjs container"
  echo "  $0 shell mongodb  # Open a shell in the mongodb container"
  echo "  $0 rebuild        # Rebuild and restart all containers"
  echo ""
}

# Check if Docker is running
check_docker() {
  if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
  fi
}

# Check if docker-compose.yml exists
check_compose_file() {
  if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Are you in the correct directory?"
    exit 1
  fi
}

# Start containers
start_containers() {
  print_step "Starting containers..."
  ./start.sh
}

# Stop containers
stop_containers() {
  print_step "Stopping containers..."
  ./stop.sh
}

# Show container status
show_status() {
  print_step "Showing container status..."
  ./status.sh
}

# Restart containers
restart_containers() {
  print_step "Restarting containers..."
  docker-compose restart $1
  if [ $? -eq 0 ]; then
    print_message "Containers restarted successfully."
  else
    print_error "Failed to restart containers."
  fi
}

# Show logs
show_logs() {
  if [ -z "$1" ]; then
    print_step "Showing logs for all containers..."
    docker-compose logs --tail=100
  else
    print_step "Showing logs for $1..."
    docker-compose logs --tail=100 $1
  fi
}

# Clean Docker resources
clean_docker() {
  print_step "Cleaning Docker resources..."
  
  print_message "Removing unused containers..."
  docker container prune -f
  
  print_message "Removing unused images..."
  docker image prune -f
  
  print_message "Removing unused volumes..."
  docker volume prune -f
  
  print_message "Removing unused networks..."
  docker network prune -f
  
  print_message "Docker cleanup complete."
}

# Rebuild containers
rebuild_containers() {
  print_step "Rebuilding containers..."
  
  print_message "Stopping containers..."
  docker-compose down
  
  print_message "Building containers with no cache..."
  docker-compose build --no-cache
  
  print_message "Starting containers..."
  docker-compose up -d
  
  if [ $? -eq 0 ]; then
    print_message "Containers rebuilt and started successfully."
  else
    print_error "Failed to rebuild containers."
  fi
}

# Open shell in container
open_shell() {
  if [ -z "$1" ]; then
    print_error "Please specify a container name."
    echo "Available containers:"
    docker-compose ps --services
    exit 1
  fi
  
  print_step "Opening shell in $1 container..."
  docker-compose exec $1 sh -c "if command -v bash > /dev/null; then bash; else sh; fi"
}

# Backup MongoDB data
backup_mongodb() {
  BACKUP_DIR="./backups"
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.gz"
  
  print_step "Backing up MongoDB data..."
  
  # Create backup directory if it doesn't exist
  mkdir -p $BACKUP_DIR
  
  # Run mongodump in the container and compress the output
  docker-compose exec -T mongodb sh -c "mongodump --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --archive" | gzip > $BACKUP_FILE
  
  if [ $? -eq 0 ]; then
    print_message "MongoDB backup created: $BACKUP_FILE"
  else
    print_error "Failed to create MongoDB backup."
  fi
}

# Restore MongoDB data
restore_mongodb() {
  if [ -z "$1" ]; then
    print_error "Please specify a backup file to restore."
    echo "Available backups:"
    ls -la ./backups/
    exit 1
  fi
  
  BACKUP_FILE=$1
  
  if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
  fi
  
  print_step "Restoring MongoDB data from $BACKUP_FILE..."
  
  # Extract and restore the backup
  gunzip -c $BACKUP_FILE | docker-compose exec -T mongodb sh -c "mongorestore --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --archive"
  
  if [ $? -eq 0 ]; then
    print_message "MongoDB data restored successfully."
  else
    print_error "Failed to restore MongoDB data."
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
    start)
      check_docker
      check_compose_file
      start_containers
      ;;
    stop)
      check_docker
      check_compose_file
      stop_containers
      ;;
    status)
      check_docker
      check_compose_file
      show_status
      ;;
    restart)
      check_docker
      check_compose_file
      restart_containers $1
      ;;
    logs)
      check_docker
      check_compose_file
      show_logs $1
      ;;
    clean)
      check_docker
      clean_docker
      ;;
    rebuild)
      check_docker
      check_compose_file
      rebuild_containers
      ;;
    shell)
      check_docker
      check_compose_file
      open_shell $1
      ;;
    backup)
      check_docker
      check_compose_file
      backup_mongodb
      ;;
    restore)
      check_docker
      check_compose_file
      restore_mongodb $1
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