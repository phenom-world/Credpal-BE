# Basic Fintech API

A basic fintech application API built with NestJS, TypeORM, and PostgreSQL. This API provides core financial services including user authentication, wallet management, and transaction processing.

## Features

- User authentication and authorization
- Wallet management (balance, deposits, withdrawals)
- Transaction processing (transfers, payments)
- Race condition handling for concurrent transactions
- API documentation with Swagger
- Caching implementation
- Environment configuration
- Unit testing setup

## Tech Stack

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **API Documentation**: Swagger
- **Logging**: Winston
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Yarn or npm package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fintech-api
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=fintech_db
JWT_SECRET=your_jwt_secret
```

4. Run database migrations:

```bash
yarn migration:run
# or
npm run migration:run
```

5. Start the development server:

```bash
yarn dev
# or
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `yarn build` - Build the application
- `yarn format` - Format code using Prettier
- `yarn start` - Start the application
- `yarn dev` - Start the application in development mode with watch
- `yarn test` - Run unit tests
- `yarn lint` - Lint the codebase
- `yarn migration:generate` - Generate a new migration
- `yarn migration:run` - Run pending migrations
- `yarn migration:revert` - Revert the last migration
- `yarn seed` - Seed the database with initial data

## Project Structure

```
src/
├── config/         # Configuration files
├── modules/        # Feature modules
│   ├── auth/      # Authentication module
│   ├── user/      # User management
│   ├── wallet/    # Wallet management
│   └── transaction/ # Transaction processing
├── common/         # Shared utilities and decorators
├── migrations/     # Database migrations
├── types/          # TypeScript type definitions
├── app.module.ts   # Root application module
├── app.controller.ts
└── main.ts         # Application entry point
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at: `http://localhost:3000/docs`

## Testing

```bash
# Run unit tests
yarn test
```
