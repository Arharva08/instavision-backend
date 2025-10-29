# Quick Setup Guide

## 📋 Prerequisites
- Node.js v14+ installed
- npm or yarn package manager

## ⚡ Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   
   Create a `.env` file in the server directory with the following variables:
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

3. **Run database migrations**
   ```bash
   npm run migrate
   ```

4. **Seed admin user**
   ```bash
   npm run seed
   ```
   
   Or run both at once:
   ```bash
   npm run setup
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the API**
   - API: http://localhost:3000
   - API Docs: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/api/health

## 🚀 Deployment to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Create new Web Service
   - Connect your GitHub repository
   - Render will auto-detect the render.yaml configuration
   - Add environment variables in Render dashboard

3. **Environment Variables in Render**
   - `NODE_ENV=production`
   - `CORS_ORIGIN=your-frontend-url`
   - Add more as needed

## 📁 Project Structure

```
server/
├── config/          # App configuration
│   ├── config.js   # Main config
│   └── swagger.js  # Swagger setup
├── controllers/     # Business logic
├── middleware/     # Express middleware
├── routes/          # API routes
├── services/        # Business services
├── tests/           # Test files
├── utils/           # Helper utilities
├── app.js           # Express app
├── server.js        # Entry point
└── render.yaml      # Render config
```

## 🔐 Authentication & Authorization

### How to use:
1. **Login** - POST to `/api/auth/login` with email and password to get JWT token
2. **Register Users** - POST to `/api/auth/register` (Admin only) to create new users
3. **Get Current User** - GET `/api/auth/me` (requires authentication)
4. **Access Protected Routes** - Include JWT token in Authorization header: `Bearer <token>`

### Roles:
- **admin**: Can register new users, view all users
- **student**: Regular users with limited access

### Example API Requests:

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@instavision.com", "password": "admin123"}'
```

**Register (Admin only):**
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

**Get Current User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## 🔧 Next Steps

- Add more routes and controllers
- Write unit tests
- Add more user features (profile update, etc.)
- Implement password reset functionality

## 📞 Need Help?

Check the main README.md for detailed documentation.

