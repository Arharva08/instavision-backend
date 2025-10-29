# InstaVision Server - User Guide

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Your `.env` file should now contain the PostgreSQL database credentials.

### 3. Run Database Migration

```bash
npm run migrate
```

This will create the `users` table in your PostgreSQL database.

### 4. Start the Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

### 5. Access the API

- **Base URL**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health
- **Get All Users**: http://localhost:3000/api/users

## API Endpoints

### Health Check
```
GET /api/health
```

### Users

#### Get All Users
```
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
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User by ID
```
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
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Testing with cURL

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

## Testing in Browser

1. Visit http://localhost:3000/api-docs for interactive API documentation
2. Click on any endpoint to see details and test it
3. Use the "Try it out" button to execute requests

## Database Configuration

The database is configured with these credentials:

- **Host**: dpg-d3v67g6r433s73cliapg-a
- **Port**: 5432
- **Database**: instavision_db
- **User**: instavision_db_user
- **Password**: 1YCZXcdOJo2K1QxkDwQKcrcn3FpQa4Zj

All credentials are stored in `.env` file.

## Project Structure

```
server/
├── config/              # Configuration files
│   ├── config.js       # Main config
│   ├── database.js     # Database connection
│   └── swagger.js      # Swagger setup
├── controllers/         # Route controllers
│   ├── health.controller.js
│   └── users.controller.js
├── middleware/          # Express middleware
├── migrations/          # Database migrations
│   ├── 001_create_users_table.sql
│   └── migrate.js
├── routes/              # API routes
│   ├── index.js
│   ├── health.routes.js
│   └── users.routes.js
├── services/            # Business logic (future)
├── utils/               # Utility functions
└── tests/               # Test files (future)
```

## Next Steps

1. **Create a user**: Add registration endpoint
2. **Update user**: Add update endpoint
3. **Delete user**: Add delete endpoint
4. **Authentication**: Add JWT authentication
5. **Validation**: Add request validation
6. **Testing**: Add unit and integration tests

## Troubleshooting

### Database Connection Error

If you get a connection error:

1. Check your `.env` file has the correct credentials
2. Verify the database is accessible
3. Check if the SSL configuration is correct for Render

### Migration Errors

If migrations fail:

1. Check database connection
2. Verify SQL syntax in migration file
3. Check if the table already exists

### Port Already in Use

If port 3000 is in use, change it in `.env`:
```env
PORT=3001
```

## Deployment to Render

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy!

For more details, see the main [README.md](./README.md).

