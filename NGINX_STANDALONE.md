# Setting Up Next.js with Nginx (Standalone)

This guide provides instructions for setting up your Next.js application with Nginx as a reverse proxy without using Docker.

## Prerequisites

- A server with Ubuntu/Debian or similar Linux distribution
- Node.js (v14 or later) installed
- npm or yarn installed
- Nginx installed
- Git (optional, for cloning your repository)

## Installation Steps

### 1. Deploy Your Next.js Application

First, deploy your Next.js application on the server:

```bash
# Clone your repository (if using Git)
git clone https://your-repository-url.git
cd your-project-directory

# Install dependencies
npm install
# or
yarn install

# Build the application
npm run build
# or
yarn build

# Start the application in production mode
npm start
# or
yarn start
```

For a more robust setup, you might want to use a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start your Next.js application with PM2
pm2 start npm --name "nextjs-app" -- start

# Make PM2 start on system boot
pm2 startup
pm2 save
```

### 2. Configure Nginx

1. Copy the provided Nginx configuration file to the Nginx sites directory:

```bash
sudo cp nginx-standalone.conf /etc/nginx/sites-available/nextjs
```

2. Edit the configuration file to match your specific setup:

```bash
sudo nano /etc/nginx/sites-available/nextjs
```

3. Update the following in the configuration:

   - Replace `/path/to/your/nextjs/app/.next` with the actual path to your Next.js `.next` directory
   - Replace `/path/to/your/nextjs/app/public/` with the actual path to your Next.js `public` directory
   - Update `server_name` to your domain name or server IP
   - Adjust any other settings as needed

4. Create a symbolic link to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/
```

5. Test the Nginx configuration:

```bash
sudo nginx -t
```

6. If the test is successful, restart Nginx:

```bash
sudo systemctl restart nginx
```

### 3. Setting Up SSL (HTTPS)

To enable HTTPS, you can use Let's Encrypt to obtain free SSL certificates:

1. Install Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

2. Obtain and install certificates:

```bash
sudo certbot --nginx -d yourdomain.com
```

3. Follow the prompts to complete the setup. Certbot will automatically update your Nginx configuration.

4. Certbot sets up automatic renewal, but you can test the renewal process with:

```bash
sudo certbot renew --dry-run
```

### 4. Troubleshooting

If you encounter issues:

1. Check Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

2. Check your Next.js application logs (if using PM2):

```bash
pm2 logs nextjs-app
```

3. Common issues:
   - Incorrect file paths in the Nginx configuration
   - Firewall blocking ports (80/443)
   - SELinux restrictions (if applicable)
   - Next.js application not running

### 5. Maintenance

- To update your Next.js application:

```bash
git pull  # If using Git
npm install
npm run build
# If using PM2
pm2 restart nextjs-app
```

- To update Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/nextjs
sudo nginx -t
sudo systemctl restart nginx
```

## Performance Optimizations

The provided Nginx configuration includes:

- Gzip compression for faster content delivery
- Cache headers for static assets
- HTTP/2 support (when using HTTPS)

For further optimizations, consider:

- Implementing a CDN
- Adding browser caching for more file types
- Enabling Brotli compression if supported by your Nginx version
