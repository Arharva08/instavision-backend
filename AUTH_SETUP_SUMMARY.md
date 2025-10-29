# Authentication System Setup - Summary

## ✅ What Was Implemented

A complete role-based authentication system with JWT tokens has been implemented for the InstaVision server.

## 📦 New Files Created

1. **`controllers/auth.controller.js`** - Authentication controller with:
   - `register()` - Register new users (Admin only)
   - `login()` - User login and JWT token generation
   - `getCurrentUser()` - Get current authenticated user

2. **`routes/auth.routes.js`** - Authentication routes

3. **`migrations/002_add_role_to_users.sql`** - Migration to add role column

4. **`migrations/seed_admin.js`** - Script to seed initial admin user

5. **`AUTH_GUIDE.md`** - Comprehensive authentication guide

## 🔧 Modified Files

1. **`package.json`**
   - Added `jsonwebtoken` dependency
   - Added `bcryptjs` dependency
   - Added new scripts: `seed`, `setup`

2. **`config/config.js`**
   - Added `jwtSecret` configuration
   - Added `jwtExpiresIn` configuration

3. **`middleware/auth.js`**
   - Implemented `authenticate()` - JWT token verification
   - Implemented `authorize()` - Role-based authorization

4. **`routes/users.routes.js`**
   - Added authentication to `/api/users` (admin only)
   - Added authentication to `/api/users/:id`

5. **`routes/index.js`**
   - Added auth routes

6. **`migrations/migrate.js`**
   - Updated to run multiple migrations in order

7. **`SETUP.md`**
   - Updated with authentication setup instructions

## 🔐 Key Features

### Authentication
- **JWT-based authentication** - Secure token-based auth
- **Password hashing** - Using bcryptjs
- **Token expiration** - 7 days by default (configurable)
- **Bearer token authentication** - Standard Authorization header

### Authorization
- **Two roles**:
  - `admin` - Can register users, view all users
  - `student` - Regular users with limited access
- **Role-based access control** - Middleware for protecting routes
- **Admin-only registration** - Only admins can create new users

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user info

**Protected User Management:**
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Authenticated)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=instavision
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@instavision.com
ADMIN_PASSWORD=admin123
```

### 3. Run Setup

```bash
npm run setup
```

This will:
1. Run database migrations (creates users table with role column)
2. Seed the admin user

### 4. Start Server

```bash
npm run dev
```

## 📖 Usage Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@instavision.com", "password": "admin123"}'
```

### Register Student (as Admin)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@instavision.com",
    "password": "password123",
    "first_name": "Student",
    "last_name": "One",
    "role": "student"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student' NOT NULL CHECK (role IN ('admin', 'student')),
    profile_image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security

1. **Passwords are hashed** using bcrypt (10 rounds)
2. **JWT tokens** for stateless authentication
3. **Role-based access control** for authorization
4. **Token expiration** after 7 days
5. **Protected routes** require authentication
6. **Admin-only registration** prevents unauthorized user creation

## 📚 Documentation

- **Quick Setup**: See [SETUP.md](./SETUP.md)
- **Detailed Auth Guide**: See [AUTH_GUIDE.md](./AUTH_GUIDE.md)
- **API Docs**: http://localhost:3000/api-docs

## 🎯 Next Steps

1. Create a frontend login page
2. Add password reset functionality
3. Add user profile update endpoint
4. Add user deletion (admin only)
5. Implement refresh tokens for better security
6. Add rate limiting for auth endpoints

## 📝 Notes

- The admin user is created with default credentials on first setup
- Change the admin password after first login
- JWT_SECRET should be a strong random string in production
- All passwords must be at least 6 characters long
- Roles are restricted to 'admin' and 'student' in the database

