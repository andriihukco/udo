# Udo-Druk

A Next.js application with MongoDB for managing printing services.

## Overview

This application provides a platform for managing printing services, user accounts, and orders. It's built with:

- **Next.js**: React framework for server-rendered applications
- **MongoDB**: NoSQL database for storing application data
- **Docker**: Containerization for consistent development and deployment
- **Redis**: For caching and session management
- **NextAuth.js**: Authentication solution for Next.js

## Features

- User authentication and authorization with role-based access control
- Admin dashboard for managing users, products, and orders
- Responsive design for desktop and mobile devices
- Environment-specific configurations for development, testing, and production

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed (for local development without Docker)

### Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/udo-druk.git
   cd udo-druk
   ```

2. Start the development environment:

   ```bash
   ./dev.sh
   # or
   npm run dev:docker
   ```

3. Access the application at http://localhost:3000

### Default Admin User

The application is seeded with a default admin user:

- Email: m@u-do.store
- Password: motherlord (should be changed in production)
- Role: superadmin

## Environment Setup

The project supports three environments:

1. **Development**: For local development with hot reloading
2. **Testing**: For testing builds in a staging environment
3. **Production**: For the live production environment

For detailed instructions on setting up and using each environment, see [ENVIRONMENTS.md](ENVIRONMENTS.md).

## Project Structure

```
udo-druk/
├── app/                  # Next.js application code
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/              # Utility functions and libraries
│   ├── models/           # MongoDB models
│   └── pages/            # Next.js pages
├── environments/         # Environment-specific configurations
│   ├── dev/              # Development environment
│   ├── test/             # Testing environment
│   └── prod/             # Production environment
├── public/               # Static files
├── scripts/              # Utility scripts
├── dev.sh                # Development environment script
├── test.sh               # Testing environment script
├── prod.sh               # Production environment script
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Scripts

- `npm run dev`: Start the Next.js development server
- `npm run dev:docker`: Start the development environment with Docker
- `npm run test:docker`: Start the testing environment with Docker
- `npm run prod:docker`: Start the production environment with Docker
- `npm run build`: Build the Next.js application
- `npm run start`: Start the Next.js production server
- `npm run lint`: Run ESLint
- `npm run seed:admin`: Seed the default admin user

For more scripts, see the `scripts` section in `package.json`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)
- [NextAuth.js](https://next-auth.js.org/)
