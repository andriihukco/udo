# Deploying U:DO Shop with Nginx

This guide explains how to deploy the U:DO Shop application using Docker, Docker Compose, and Nginx as a reverse proxy.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git installed on your server
- Basic knowledge of Docker and Nginx

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd udo-druk
```

### 2. Configuration

The deployment uses the following components:

- **Next.js Application**: The main application built with Next.js
- **Nginx**: Acts as a reverse proxy, handling HTTP requests and forwarding them to the Next.js application
- **MongoDB**: Database for storing application data
- **Redis**: Used for caching and session management

### 3. Environment Variables

Make sure your `.env` or `.env.local` file is properly configured with the necessary environment variables:

```
# Database
MONGODB_URI=mongodb://admin:password@mongodb:27017/druk?authSource=admin

# Redis
REDIS_URI=redis://redis:6379

# Add any other required environment variables here
```

### 4. Start the Application

We've provided a convenient script to start the application:

```bash
./start.sh
```

This script will:

- Build the Docker images if needed
- Start all the containers defined in `docker-compose.yml`
- Display the URL where you can access the application

### 5. Access the Application

Once the application is running, you can access it at:

```
http://your-server-ip
```

Or if you've configured a domain name and DNS:

```
http://your-domain.com
```

### 6. Stop the Application

To stop the application, use the provided script:

```bash
./stop.sh
```

## SSL Configuration

To enable HTTPS:

1. Obtain SSL certificates for your domain
2. Create a `ssl` directory in the project root
3. Place your certificates in the `ssl` directory:
   - `fullchain.pem`: Your certificate chain
   - `privkey.pem`: Your private key
4. Uncomment the SSL-related lines in `nginx.conf` and `docker-compose.yml`
5. Restart the application with `./start.sh`

## Troubleshooting

### Checking Logs

To view logs for any of the containers:

```bash
# View logs for all containers
docker-compose logs

# View logs for a specific container
docker-compose logs nginx
docker-compose logs nextjs
docker-compose logs mongodb
docker-compose logs redis
```

### Common Issues

1. **Port conflicts**: If port 80 or 443 is already in use, modify the port mappings in `docker-compose.yml`
2. **Database connection issues**: Ensure MongoDB is running and the connection string is correct
3. **Nginx configuration errors**: Check the Nginx logs for any configuration issues

## Customization

### Custom Domain

To use a custom domain, update the `server_name` directive in `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    # ...
}
```

### Scaling

To scale the application for higher traffic:

1. Increase the number of Next.js instances
2. Set up a load balancer
3. Configure MongoDB replication
4. Add Redis clustering

## Security Considerations

1. Use strong passwords for MongoDB and other services
2. Enable HTTPS with proper SSL certificates
3. Set up proper firewall rules
4. Regularly update all components
5. Implement rate limiting in Nginx for protection against DDoS attacks
