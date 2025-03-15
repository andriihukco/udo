# U:DO Shop Deployment Options

This document outlines the different deployment options available for the U:DO Shop application.

## Option 1: Docker Compose Deployment

The Docker Compose deployment is ideal for environments where you want to run the entire stack (Next.js, Nginx, MongoDB, Redis) in containers.

### Advantages:

- Consistent environment across development and production
- Easy to set up and manage all services
- Isolated environment for each service
- Simple scaling of individual services

### How to Use:

1. Make sure Docker and Docker Compose are installed on your server
2. Run `./start.sh` to start all services
3. Run `./stop.sh` to stop all services

For detailed instructions, see [NGINX_DEPLOYMENT.md](NGINX_DEPLOYMENT.md)

## Option 2: Standalone Nginx Deployment

The standalone deployment is suitable when you want to run the Next.js application directly on the server with Nginx as a reverse proxy.

### Advantages:

- Simpler setup with fewer moving parts
- Direct access to the file system
- Easier debugging and log access
- Better performance on smaller servers

### How to Use:

1. Make sure Node.js and Nginx are installed on your server
2. Run `sudo ./deploy-standalone.sh` to configure and deploy
3. Follow the prompts to complete the setup

For detailed instructions, see [NGINX_STANDALONE.md](NGINX_STANDALONE.md)

## Choosing the Right Option

### Choose Docker Compose if:

- You need a consistent environment across different servers
- You want to isolate services from each other
- You're deploying to a server with ample resources
- You need to scale individual components independently
- You want to avoid installing dependencies directly on the host

### Choose Standalone Deployment if:

- You're deploying to a smaller server with limited resources
- You need direct access to the file system
- You want a simpler setup with fewer components
- You're more comfortable with traditional server management
- You need maximum performance on limited hardware

## Additional Considerations

### SSL Configuration

Both deployment options support SSL configuration using Let's Encrypt. The Docker Compose option handles this through the Nginx container, while the standalone option uses Certbot directly on the host.

### Database Management

- **Docker Compose**: MongoDB runs in a container, with data persisted in a Docker volume
- **Standalone**: You'll need to install and configure MongoDB separately

### Process Management

- **Docker Compose**: Container orchestration handles process management
- **Standalone**: PM2 is recommended for process management (included in the deployment script)

### Monitoring

- **Docker Compose**: Docker provides basic monitoring capabilities
- **Standalone**: You can use PM2 monitoring or install additional monitoring tools

## Troubleshooting

For issues with either deployment option, check the respective log files:

### Docker Compose Logs

```bash
docker-compose logs nextjs
docker-compose logs nginx
docker-compose logs mongodb
```

### Standalone Logs

```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Next.js logs (if using PM2)
pm2 logs nextjs-app
```
