# Candidate Management API

NestJS API for managing candidates with PostgreSQL and TypeORM.

## Quick Start

### 1. Start with Docker
```bash
# Production
docker-compose up --build

# Development (with hot reload)
docker-compose -f docker-compose.dev.yml up --build
```

### 2. Seed Database
```bash
# Run in background
docker-compose up -d --build

# Seed initial data
npm run seed
```

### 3. Access Services
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api
- **Database**: localhost:5432

## Local Development

```bash
# Install dependencies
npm install

# Start only database
docker-compose up postgres -d

# Start application
npm run start:dev

# Seed data
npm run seed
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

## Database

- **Database**: `candidate_management`
- **Username**: `postgres`
- **Password**: `postgres`
- **Auto-created** on first run
- **Seeded** with job offers

## Stop Services

```bash
# Stop all
docker-compose down

# Stop and remove data
docker-compose down -v
```