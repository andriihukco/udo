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
  echo -e "${CYAN}U:DO Shop Database Utilities${NC}"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  status      Show database status"
  echo "  backup      Backup MongoDB data"
  echo "  restore     Restore MongoDB data from backup"
  echo "  shell       Open MongoDB shell"
  echo "  import      Import data from JSON file"
  echo "  export      Export data to JSON file"
  echo "  indexes     Create or verify indexes"
  echo "  clean       Clean database (CAUTION: Deletes data)"
  echo "  seed        Seed database with sample data"
  echo "  help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 status                       # Show database status"
  echo "  $0 backup                       # Backup MongoDB data"
  echo "  $0 restore backups/mongodb_backup_20230101_120000.gz  # Restore from backup"
  echo ""
}

# Check if Docker is running
check_docker() {
  if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
  fi
}

# Check if MongoDB container is running
check_mongodb() {
  MONGODB_RUNNING=$(docker-compose ps -q mongodb)
  if [ -z "$MONGODB_RUNNING" ]; then
    print_error "MongoDB container is not running. Please start it with: ./start.sh"
    exit 1
  fi
}

# Show database status
show_status() {
  print_step "Showing MongoDB status..."
  docker-compose exec mongodb mongosh --quiet --eval "db.serverStatus()"
}

# Backup MongoDB data
backup_db() {
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
restore_db() {
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
  gunzip -c $BACKUP_FILE | docker-compose exec -T mongodb sh -c "mongorestore --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --drop --archive"
  
  if [ $? -eq 0 ]; then
    print_message "MongoDB data restored successfully."
  else
    print_error "Failed to restore MongoDB data."
  fi
}

# Open MongoDB shell
open_shell() {
  print_step "Opening MongoDB shell..."
  docker-compose exec mongodb mongosh --host localhost --port 27017 -u admin -p password --authenticationDatabase admin
}

# Import data from JSON file
import_data() {
  if [ -z "$1" ]; then
    print_error "Please specify a JSON file to import."
    exit 1
  fi
  
  if [ -z "$2" ]; then
    print_error "Please specify a collection name to import into."
    exit 1
  fi
  
  JSON_FILE=$1
  COLLECTION=$2
  
  if [ ! -f "$JSON_FILE" ]; then
    print_error "JSON file not found: $JSON_FILE"
    exit 1
  fi
  
  print_step "Importing data from $JSON_FILE into collection $COLLECTION..."
  
  # Copy the file to the container and import it
  docker cp $JSON_FILE druk-mongodb:/tmp/import.json
  docker-compose exec mongodb mongoimport --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --db druk --collection $COLLECTION --file /tmp/import.json
  
  if [ $? -eq 0 ]; then
    print_message "Data imported successfully."
  else
    print_error "Failed to import data."
  fi
}

# Export data to JSON file
export_data() {
  if [ -z "$1" ]; then
    print_error "Please specify a collection name to export."
    exit 1
  fi
  
  COLLECTION=$1
  EXPORT_DIR="./exports"
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  EXPORT_FILE="$EXPORT_DIR/${COLLECTION}_export_$TIMESTAMP.json"
  
  # Create export directory if it doesn't exist
  mkdir -p $EXPORT_DIR
  
  print_step "Exporting collection $COLLECTION to $EXPORT_FILE..."
  
  # Export the collection to a temporary file in the container and copy it out
  docker-compose exec -T mongodb mongoexport --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --db druk --collection $COLLECTION --out /tmp/export.json
  docker cp druk-mongodb:/tmp/export.json $EXPORT_FILE
  
  if [ $? -eq 0 ]; then
    print_message "Data exported successfully to $EXPORT_FILE"
  else
    print_error "Failed to export data."
  fi
}

# Create or verify indexes
create_indexes() {
  print_step "Creating or verifying indexes..."
  
  # Define indexes in a JavaScript file
  cat > ./indexes.js << EOL
db = db.getSiblingDB('druk');

// Products collection indexes
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ "tags": 1 });
db.products.createIndex({ createdAt: -1 });

// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Orders collection indexes
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ status: 1 });

print("Indexes created or verified successfully.");
EOL
  
  # Copy the file to the container and run it
  docker cp ./indexes.js druk-mongodb:/tmp/indexes.js
  docker-compose exec mongodb mongosh --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --file /tmp/indexes.js
  
  # Clean up
  rm ./indexes.js
  
  if [ $? -eq 0 ]; then
    print_message "Indexes created or verified successfully."
  else
    print_error "Failed to create or verify indexes."
  fi
}

# Clean database
clean_db() {
  print_warning "This will delete all data in the database. Are you sure? (y/n)"
  read -r confirm
  
  if [ "$confirm" != "y" ]; then
    print_message "Operation cancelled."
    exit 0
  fi
  
  print_step "Cleaning database..."
  
  # Create a JavaScript file to drop all collections
  cat > ./clean.js << EOL
db = db.getSiblingDB('druk');

// Get all collections
var collections = db.getCollectionNames();

// Drop each collection
collections.forEach(function(collection) {
  if (collection.indexOf('system.') !== 0) {
    db[collection].drop();
    print("Dropped collection: " + collection);
  }
});

print("Database cleaned successfully.");
EOL
  
  # Copy the file to the container and run it
  docker cp ./clean.js druk-mongodb:/tmp/clean.js
  docker-compose exec mongodb mongosh --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --file /tmp/clean.js
  
  # Clean up
  rm ./clean.js
  
  if [ $? -eq 0 ]; then
    print_message "Database cleaned successfully."
  else
    print_error "Failed to clean database."
  fi
}

# Seed database with sample data
seed_db() {
  print_step "Seeding database with sample data..."
  
  # Create a JavaScript file with sample data
  cat > ./seed.js << EOL
db = db.getSiblingDB('druk');

// Sample products
var products = [
  {
    name: "T-Shirt",
    description: "A comfortable cotton t-shirt",
    price: 19.99,
    category: "Clothing",
    tags: ["cotton", "casual", "summer"],
    stock: 100,
    images: ["tshirt1.jpg", "tshirt2.jpg"],
    createdAt: new Date()
  },
  {
    name: "Jeans",
    description: "Classic blue jeans",
    price: 49.99,
    category: "Clothing",
    tags: ["denim", "casual", "everyday"],
    stock: 50,
    images: ["jeans1.jpg", "jeans2.jpg"],
    createdAt: new Date()
  },
  {
    name: "Sneakers",
    description: "Comfortable athletic shoes",
    price: 79.99,
    category: "Footwear",
    tags: ["sports", "casual", "running"],
    stock: 30,
    images: ["sneakers1.jpg", "sneakers2.jpg"],
    createdAt: new Date()
  }
];

// Insert products
db.products.insertMany(products);

// Sample users (password is 'password' hashed)
var users = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "$2b$10$X7o4.KM5K4D2k4z9v9H8.uVhQXoOnY3wYf9h3nH3Xyw4QkAl3Oc1W",
    role: "user",
    createdAt: new Date()
  },
  {
    username: "admin",
    email: "admin@example.com",
    password: "$2b$10$X7o4.KM5K4D2k4z9v9H8.uVhQXoOnY3wYf9h3nH3Xyw4QkAl3Oc1W",
    role: "admin",
    createdAt: new Date()
  }
];

// Insert users
db.users.insertMany(users);

print("Database seeded successfully with sample data.");
EOL
  
  # Copy the file to the container and run it
  docker cp ./seed.js druk-mongodb:/tmp/seed.js
  docker-compose exec mongodb mongosh --host localhost --port 27017 -u admin -p password --authenticationDatabase admin --file /tmp/seed.js
  
  # Clean up
  rm ./seed.js
  
  if [ $? -eq 0 ]; then
    print_message "Database seeded successfully with sample data."
  else
    print_error "Failed to seed database."
  fi
}

# Main function
main() {
  # Check if Docker is running
  check_docker
  
  # Check if command is provided
  if [ $# -eq 0 ]; then
    show_help
    exit 0
  fi
  
  # Check if MongoDB container is running
  check_mongodb
  
  # Parse command
  COMMAND=$1
  shift
  
  case $COMMAND in
    status)
      show_status
      ;;
    backup)
      backup_db
      ;;
    restore)
      restore_db "$1"
      ;;
    shell)
      open_shell
      ;;
    import)
      import_data "$1" "$2"
      ;;
    export)
      export_data "$1"
      ;;
    indexes)
      create_indexes
      ;;
    clean)
      clean_db
      ;;
    seed)
      seed_db
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