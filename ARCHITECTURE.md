# Architecture Overview

## 📐 Project Structure

```
server/
├── config/                  # Configuration files
│   ├── config.js           # Main configuration
│   └── swagger.js          # Swagger/OpenAPI setup
├── controllers/             # Route controllers (business logic)
│   └── health.controller.js
├── middleware/              # Express middleware
│   ├── asyncHandler.js     # Async error wrapper
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Global error handler
│   └── validateRequest.js  # Request validation
├── routes/                  # API routes
│   ├── index.js            # Main router
│   └── health.routes.js    # Health check routes
├── services/                # Business logic services
├── tests/                   # Test files
├── utils/                     # Utility functions
│   ├── constants.js         # App constants
│   ├── helpers.js          # Helper functions
│   ├── logger.js           # Logging utility
│   └── response.js         # Response helpers
├── app.js                   # Express app configuration
├── server.js                # Entry point
├── package.json             # Dependencies
├── render.yaml              # Render deployment config
└── .env.example            # Environment variables template
```

## 🔄 Request Flow

1. **Request arrives** → `server.js`
2. **App setup** → `app.js` (middleware, routes)
3. **Route matching** → `routes/index.js`
4. **Specific route** → `routes/*.routes.js`
5. **Controller** → `controllers/*.controller.js`
6. **Business logic** → `services/*.service.js` (optional)
7. **Response** → Client

## 🛠️ Middleware Stack

```
1. Helmet          → Security headers
2. CORS            → Cross-origin requests
3. Compression     → Response compression
4. Morgan          → Request logging
5. Rate Limiting   → API rate limiting
6. Body Parser    → JSON & URL encoded parsing
7. Routes          → Application routes
8. Error Handler   → Error catching (last)
```

## 📝 Adding New Features

### Adding a New Route

1. **Create controller** (`controllers/users.controller.js`):
```javascript
const getUsers = (req, res) => {
  res.json({ users: [] });
};
module.exports = { getUsers };
```

2. **Create route** (`routes/users.routes.js`):
```javascript
const router = require('express').Router();
const { getUsers } = require('../controllers/users.controller');
router.get('/', getUsers);
module.exports = router;
```

3. **Register route** (`routes/index.js`):
```javascript
router.use('/users', require('./users.routes'));
```

### Adding Middleware

Create new middleware in `middleware/` folder and use in `app.js` or specific routes.

### Adding Services

Add business logic in `services/` folder and import in controllers.

## 🔐 Security Features

- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Request validation ready
- ✅ Authentication placeholder
- ✅ Error handling without leaking sensitive info

## 🚀 Deployment Ready

- ✅ Environment configuration
- ✅ Render.yaml configuration
- ✅ Production-ready middleware
- ✅ Health check endpoint
- ✅ Proper error handling
- ✅ Git ignore configured

## 📚 Documentation

- Swagger UI at `/api-docs`
- OpenAPI 3.0 specification
- Auto-generated from code comments
- Test directly from browser

