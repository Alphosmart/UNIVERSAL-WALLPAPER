# Troubleshooting Guide

## Common Issues and Solutions

### 1. 404 Not Found Error

If you're seeing a 404 error, try these steps:

#### Check if Backend is Running
```bash
cd /home/cyberbro/Documents/MERN/backend
node index.js
```
The backend should start on `http://localhost:8080`

#### Check if Frontend is Running
```bash
cd /home/cyberbro/Documents/MERN/frontend
npm start
```
The frontend should start on `http://localhost:3000`

#### Verify API Endpoints
Test backend endpoints using curl or Postman:
```bash
# Test if backend is responding
curl http://localhost:8080/api/get-product

# Test user details (requires authentication)
curl http://localhost:8080/api/user-details
```

### 2. CORS Issues

If you see CORS errors, ensure your backend CORS configuration includes your frontend URL:
```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}))
```

### 3. Database Connection Issues

If you see database connection errors:
1. Ensure MongoDB is running
2. Check your `.env` file has correct `MONGODB_URI`
3. Verify network connectivity to MongoDB Atlas

### 4. Authentication Issues

If login/logout isn't working:
1. Check if cookies are being set
2. Verify JWT token generation
3. Ensure `TOKEN_SECRET_KEY` is set in `.env`

### 5. Component Issues

If specific components aren't loading:
1. Check console for JavaScript errors
2. Verify all imports are correct
3. Ensure Tailwind CSS is properly configured

## Quick Start Commands

### Start Backend
```bash
cd backend
npm install  # if not done already
node index.js
```

### Start Frontend
```bash
cd frontend
npm install  # if not done already
npm start
```

### Both at Once (if you have concurrently installed)
```bash
npm run dev  # if configured in package.json
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
TOKEN_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=8080
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8080
```

## Development Tips

1. **Keep both servers running** - Frontend (3000) and Backend (8080)
2. **Check browser console** for JavaScript errors
3. **Check terminal** for server errors
4. **Use browser dev tools** to inspect network requests
5. **Clear browser cache** if you see stale content

## Testing Endpoints

Use these commands to test if your backend is working:

```bash
# Test basic connectivity
curl http://localhost:8080/api/get-product

# Test user signup
curl -X POST http://localhost:8080/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test user signin
curl -X POST http://localhost:8080/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Test authenticated endpoint
curl http://localhost:8080/api/user-details \
  -b cookies.txt
```
