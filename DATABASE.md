# Database Setup Guide

## PostgreSQL Configuration

This project uses PostgreSQL database hosted on Render.

## Environment Variables

The following environment variables are configured in `.env.example`:

```env
DATABASE_HOST=dpg-d3v67g6r433s73cliapg-a
DATABASE_PORT=5432
DATABASE_NAME=instavision_db
DATABASE_USER=instavision_db_user
DATABASE_PASSWORD=1YCZXcdOJo2K1QxkDwQKcrcn3FpQa4Zj
DATABASE_URL=postgresql://instavision_db_user:1YCZXcdOJo2K1QxkDwQKcrcn3FpQa4Zj@dpg-d3v67g6r433s73cliapg-a:5432/instavision_db
```

## Running Migrations

### First Time Setup

1. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

This will create the `users` table in your database.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Get All Users

```bash
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "profile_image_url": null,
      "bio": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User by ID

```bash
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_image_url": null,
    "bio": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Testing the Database Connection

You can test the database connection by checking the health endpoint:

```bash
curl http://localhost:3000/api/health
```

If the database is connected, you'll see:
```json
{
  "success": true,
  "message": "Server is running successfully",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Adding New Tables

1. Create a new migration file in `migrations/` folder:
   ```bash
   # migrations/002_create_posts_table.sql
   ```

2. Add the migration script logic in `migrations/migrate.js` or create a new migration runner for versioned migrations.

3. Run the migration:
   ```bash
   npm run migrate
   ```

## Troubleshooting

### Connection Errors

If you're getting connection errors:

1. Check that your `.env` file has the correct database credentials
2. Verify the database is accessible from your network
3. Check if the database host allows connections from your IP

### Migration Errors

If migrations fail:

1. Check the database connection
2. Verify the SQL syntax is correct
3. Check if the table already exists (use `CREATE TABLE IF NOT EXISTS`)

## Production Deployment

For production on Render:

1. Set environment variables in Render dashboard
2. The migrations can be run manually or added to the build script
3. Database credentials are already configured in `.env.example`

