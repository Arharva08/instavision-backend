# Authentication & Authorization Guide

This guide explains how to use the role-based authentication system in InstaVision.

## 📋 Overview

The authentication system uses JWT (JSON Web Tokens) and supports two roles:
- **admin**: Can register new users, view all users
- **student**: Regular users with limited access

## 🚀 Setup

### 1. Configure Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=instavision
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Admin User (for seeding)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@instavision.com
ADMIN_PASSWORD=admin123
```

### 2. Run Database Migrations

```bash
npm run migrate
```

This will:
- Create the `users` table
- Add the `role` column with admin/student support

### 3. Seed Admin User

```bash
npm run seed
```

This creates the initial admin user with the credentials specified in your `.env` file.

### 4. Start the Server

```bash
npm run dev
```

## 🔐 API Endpoints

### Authentication Endpoints

#### 1. Login
**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "email": "admin@instavision.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@instavision.com",
      "first_name": "Admin",
      "last_name": "User",
      "role": "admin"
    }
  }
}
```

#### 2. Register New User (Admin Only)
**POST** `/api/auth/register`

Only admins can register new users.

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request:**
```json
{
  "username": "student1",
  "email": "student1@instavision.com",
  "password": "password123",
  "first_name": "Student",
  "last_name": "One",
  "role": "student",
  "bio": "Optional bio",
  "profile_image_url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 2,
    "username": "student1",
    "email": "student1@instavision.com",
    "first_name": "Student",
    "last_name": "One",
    "role": "student",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Get Current User
**GET** `/api/auth/me`

Get information about the currently authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@instavision.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "bio": null,
    "profile_image_url": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Protected User Endpoints

#### 1. Get All Users (Admin Only)
**GET** `/api/users`

List all users. Only admins can access this.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@instavision.com",
      "first_name": "Admin",
      "last_name": "User",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get User by ID
**GET** `/api/users/:id`

Get a specific user by ID.

**Headers:**
```
Authorization: Bearer <token>
```

## 🛡️ Middleware

### Authentication Middleware
Protects routes by verifying JWT tokens.

```javascript
const { authenticate } = require('./middleware/auth');

router.get('/protected', authenticate, controller.function);
```

### Authorization Middleware
Checks user roles for access control.

```javascript
const { authorize } = require('./middleware/auth');

// Admin only
router.get('/admin-only', authenticate, authorize('admin'), controller.function);

// Admin or Student
router.get('/both', authenticate, authorize('admin', 'student'), controller.function);
```

## 📝 Example Usage

### cURL Examples

**1. Login as Admin:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@instavision.com", "password": "admin123"}'
```

**2. Register a Student (as Admin):**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
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

**3. Get Current User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/Fetch Examples

**Login:**
```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@instavision.com',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  console.log('Token:', data.data.token);
  localStorage.setItem('token', data.data.token);
};
```

**Get Current User:**
```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log('Current user:', data.data);
};
```

**Register New User (Admin):**
```javascript
const registerUser = async (userData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: 'student'
    })
  });
  
  const data = await response.json();
  console.log('Registered user:', data.data);
};
```

## 🔒 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **Role-Based Access Control**: Different permissions for different roles
4. **Token Expiration**: Tokens expire after 7 days (configurable)
5. **Protected Routes**: Authentication required for most endpoints
6. **Admin-Only Registration**: Only admins can create new users

## 🚨 Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided. Authorization required."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. You do not have permission to perform this action."
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

## 📚 Additional Resources

- API Documentation: http://localhost:3000/api-docs
- Server Setup: See [SETUP.md](./SETUP.md)
- Architecture: See [ARCHITECTURE.md](./ARCHITECTURE.md)

