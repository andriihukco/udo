# Environment Setup and Build Process

This document explains how to set up and use the different environments (development, testing, and production) for the udo-druk application.

## Environment Structure

The project is set up with three distinct environments:

1. **Development (dev)**: For local development with hot reloading
2. **Testing (test)**: For testing builds in a staging environment
3. **Production (prod)**: For the live production environment

Each environment has its own configuration files in the `environments/` directory:

```
environments/
├── dev/
│   ├── docker-compose.dev.yml
│   └── .env.dev
├── test/
│   ├── docker-compose.test.yml
│   ├── nginx.test.conf
│   └── .env.test
└── prod/
    ├── docker-compose.prod.yml
    ├── nginx.prod.conf
    └── .env.prod.example
```

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed (for local development without Docker)

## Development Environment

### Using Docker (Recommended)

The development environment uses Docker to provide a consistent development experience with hot reloading.

```bash
# Start the development environment
npm run dev:docker
# or directly
./dev.sh
```

This will:

1. Set up the development environment with MongoDB and Redis
2. Start the Next.js development server with hot reloading
3. Seed the default admin user

The application will be available at http://localhost:3000.

### Without Docker

If you prefer to run the development environment without Docker:

```bash
# Install dependencies
npm install

# Copy environment variables
cp environments/dev/.env.dev .env.local

# Start the development server
npm run dev
```

You'll need to have MongoDB and Redis running locally or update the connection strings in `.env.local`.

## Testing Environment

The testing environment is designed to mimic the production environment but with test data.

```bash
# Start the testing environment
npm run test:docker
# or directly
./test.sh
```

This will:

1. Build the application for testing
2. Set up the testing environment with MongoDB and Redis
3. Start the application with Nginx
4. Seed the default admin user

The application will be available at http://test.yourdomain.com (or the domain you specify during setup).

## Production Environment

The production environment is optimized for performance and security.

### Preparation

Before deploying to production, you need to create a production environment file:

```bash
# Create production environment file from example
cp environments/prod/.env.prod.example environments/prod/.env.prod

# Edit the file with your production values
nano environments/prod/.env.prod
```

### Deployment

```bash
# Start the production environment
npm run prod:docker
# or directly
./prod.sh
```

This will:

1. Build the application for production
2. Set up the production environment with MongoDB and Redis
3. Configure Nginx with SSL (if selected)
4. Seed the default admin user

The application will be available at your domain (http and https if SSL is configured).

## Building for Different Environments

You can build the application for different environments without starting the Docker containers:

```bash
# Build for development
npm run build:dev

# Build for testing
npm run build:test

# Build for production
npm run build:prod
```

## Starting the Application for Different Environments

You can start the application for different environments without Docker:

```bash
# Start for development
npm run start:dev

# Start for testing
npm run start:test

# Start for production
npm run start:prod
```

## Environment Variables

Each environment has its own `.env` file with environment-specific variables:

- `.env.dev` - Development environment variables
- `.env.test` - Testing environment variables
- `.env.prod` - Production environment variables (create from `.env.prod.example`)

## Docker Configuration

Each environment has its own Docker Compose file and Dockerfile:

- `docker-compose.dev.yml` and `Dockerfile.dev` - Development environment
- `docker-compose.test.yml` and `Dockerfile.test` - Testing environment
- `docker-compose.prod.yml` and `Dockerfile.prod` - Production environment

## Nginx Configuration

The testing and production environments use Nginx as a reverse proxy:

- `nginx.test.conf` - Testing environment Nginx configuration
- `nginx.prod.conf` - Production environment Nginx configuration

## SSL Certificates

The production environment supports SSL certificates using Let's Encrypt:

1. When running `./prod.sh`, you'll be asked if you want to obtain SSL certificates
2. If you choose yes, the script will use Certbot to obtain certificates from Let's Encrypt
3. Certificates will be automatically renewed by the Certbot container

## MongoDB

Each environment has its own MongoDB database:

- `druk_dev` - Development database
- `druk_test` - Testing database
- `druk_prod` - Production database

### Database Backup and Restore

The project includes scripts for backing up and restoring the MongoDB database in the production environment.

#### Backup

To create a backup of the production database:

```bash
# Using npm script
npm run backup

# Or directly
./backup.sh
```

This will:

1. Check if the MongoDB container is running
2. Create a backup of the production database
3. Save the backup to the `./backups/mongodb/` directory with a timestamp
4. Automatically clean up old backups (keeping the 10 most recent)

#### Restore

To restore a backup of the production database:

```bash
# Using npm script
npm run restore

# Or directly
./restore.sh
```

This will:

1. Check if the MongoDB container is running
2. List available backups
3. Prompt you to select a backup or use the most recent one
4. Restore the selected backup to the production database
5. Offer to restart the application containers

## Default Admin User

Each environment is seeded with a default admin user:

- Email: m@u-do.store
- Password: motherlord (should be changed in production)
- Role: superadmin

This user is undeletable to ensure there's always an admin account available.
