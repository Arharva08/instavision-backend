# Quick Start Guide - Registration Flow

## 🔑 Proper Workflow for Registering Users

### Step 1: First, Login as Admin

**POST** `http://localhost:3000/api/auth/login`

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
      "role": "admin"
    }
  }
}
```

👉 **Copy the token from the response!**

### Step 2: Use the Token to Register New Users

**POST** `http://localhost:3000/api/auth/register`

**Headers:**
```
Authorization: Bearer <your-admin-token-from-step-1>
Content-Type: application/json
```

**Body:**
```json
{
  "username": "BATCH001",
  "email": "atharva@example.com",
  "password": "123456",
  "first_name": "Atharva",
  "last_name": "Pawar",
  "bio": "demo",
  "profile_image_url": "string"
}
```

⚠️ **Note:** The `role` field is NOT included - all registered users are automatically set to `student` role.

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 2,
    "username": "BATCH001",
    "email": "atharva@example.com",
    "first_name": "Atharva",
    "last_name": "Pawar",
    "role": "student",
    "bio": "demo",
    "profile_image_url": "string",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 📝 Important Notes

1. **Only admins can register users** - You must be logged in as an admin first
2. **All registered users are students** - The role is automatically set to 'student'
3. **You cannot register other admins** through this endpoint for security
4. **Tokens expire** after 7 days, login again if your token expires

## 🐛 Troubleshooting

### "No token provided" Error
- You forgot to login first
- You forgot to include the `Authorization` header
- Solution: Login again and copy the new token

### "Access denied" Error (403)
- You're not logged in as an admin
- Your token has expired
- Solution: Login again as admin

### "User already exists" Error (409)
- Email or username is already taken
- Solution: Use a different email or username

## 🎯 Using Swagger UI

1. Go to `http://localhost:3000/api-docs`
2. Click the **"Authorize"** button (top right)
3. In the popup, enter: `Bearer YOUR_TOKEN_HERE` (replace YOUR_TOKEN_HERE with actual token)
4. Click "Authorize"
5. Now you can use all protected endpoints
6. Click "Try it out" on any endpoint to test

## 📚 Complete Example (cURL)

```bash
# Step 1: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@instavision.com", "password": "admin123"}'

# Step 2: Copy the token from response, then register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer PASTE_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@example.com",
    "password": "123456",
    "first_name": "Student",
    "last_name": "One"
  }'
```

## 🚀 Next Steps

After registering users, they can login with their credentials:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student1@example.com", "password": "123456"}'
```

