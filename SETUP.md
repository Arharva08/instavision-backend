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
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the API**
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

## 🔧 Next Steps

- Add database connection (MongoDB, PostgreSQL, etc.)
- Implement authentication (JWT)
- Add more routes and controllers
- Write unit tests
- Add logging service

## 📞 Need Help?

Check the main README.md for detailed documentation.

