# Candidate Management API

A NestJS application for managing candidates with PostgreSQL database and TypeORM.

## Prerequisites

- Docker and Docker Compose installed on your system

## Quick Start

### Production Mode

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Development Mode

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d --build
```

## Services

- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
  - Database: `candidate_management`
  - Username: `postgres`
  - Password: `postgres`

## Development

### Local Development (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL (using Docker):
```bash
docker-compose up postgres -d
```

3. Start the application:
```bash
npm run start:dev
```

### Database Management

- The database will be automatically created when you first run the application
- TypeORM will synchronize the schema in development mode
- Data persists in Docker volumes

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## Environment Variables

The application uses the following environment variables:

- `DATABASE_HOST`: Database host (default: localhost)
- `DATABASE_PORT`: Database port (default: 5432)
- `DATABASE_USERNAME`: Database username (default: postgres)
- `DATABASE_PASSWORD`: Database password (default: postgres)
- `DATABASE_NAME`: Database name (default: candidate_management)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 3000)
