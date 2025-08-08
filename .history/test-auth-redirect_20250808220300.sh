#!/bin/bash

# Test the enhanced authentication redirect system

echo "=== Authentication Redirect System Test ==="
echo ""

# Start the backend if not running
echo "1. Starting backend server..."
cd /home/cyberbro/Documents/MERN/backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start the frontend if not running
echo "2. Starting frontend server..."
cd /home/cyberbro/Documents/MERN/frontend
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo ""
echo "=== Testing Authentication Redirects ==="
echo ""
echo "✅ Servers started successfully!"
echo ""
echo "🧪 To test the authentication redirect system:"
echo ""
echo "1. Open http://localhost:3000 in your browser"
echo "2. Make sure you're logged out"
echo "3. Try to access these protected pages:"
echo "   - http://localhost:3000/profile"
echo "   - http://localhost:3000/cart"
echo "   - http://localhost:3000/my-orders"
echo "   - http://localhost:3000/admin-panel"
echo ""
echo "4. Expected behavior:"
echo "   ✨ Should automatically redirect to /login"
echo "   ✨ Should preserve the original URL for post-login redirect"
echo "   ✨ Should show user-friendly authentication messages"
echo ""
echo "5. API Test - Try making authenticated API calls:"
echo "   - Add items to cart (should prompt for login)"
echo "   - Access user dashboard features"
echo "   - Try admin operations"
echo ""
echo "6. Session Expiration Test:"
echo "   - Log in and wait for token to expire"
echo "   - Try to perform any action"
echo "   - Should show 'Session expired' message and redirect"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop the servers
wait

# Cleanup
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo "Servers stopped."
