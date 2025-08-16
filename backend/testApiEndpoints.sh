#!/bin/bash

# API Endpoint Testing Script
# This script tests all the multi-currency and settings endpoints

echo "=== TESTING API ENDPOINTS ==="
echo ""

# Backend URL
BACKEND_URL="http://localhost:8080/api"

# Test 1: Test product endpoints with currency parameter
echo "1. Testing Product Endpoints with Currency Support..."

# Test getting products with currency conversion
echo "  - Testing GET /get-product?currency=USD"
curl -s "$BACKEND_URL/get-product?currency=USD" | jq -r '.success // "Error"' || echo "  ⚠️  Backend may not be running"

echo "  - Testing GET /get-product?currency=NGN"
curl -s "$BACKEND_URL/get-product?currency=NGN" | jq -r '.success // "Error"' || echo "  ⚠️  Backend may not be running"

echo ""

# Test 2: Test settings endpoints (requires admin authentication)
echo "2. Testing Settings Endpoints..."

echo "  - Testing GET /admin/settings (requires authentication)"
curl -s "$BACKEND_URL/admin/settings" | jq -r '.message // "Requires authentication"' || echo "  ⚠️  Backend may not be running"

echo ""

# Test 3: Test user preferences endpoints (requires user authentication)
echo "3. Testing User Preferences Endpoints..."

echo "  - Testing GET /user-preferences (requires authentication)"
curl -s "$BACKEND_URL/user-preferences" | jq -r '.message // "Requires authentication"' || echo "  ⚠️  Backend may not be running"

echo ""

# Test 4: Check if all required routes exist
echo "4. Testing Route Availability..."

routes=(
    "get-product"
    "product"
    "add-product"
    "user-products"
    "user-preferences"
    "admin/settings"
    "signup"
    "signin"
    "cart/add"
)

for route in "${routes[@]}"; do
    echo "  - Testing route: /$route"
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/$route" || echo "000")
    
    if [ "$response" = "000" ]; then
        echo "    ⚠️  Backend not running"
    elif [ "$response" = "404" ]; then
        echo "    ❌ Route not found"
    elif [ "$response" = "401" ] || [ "$response" = "403" ]; then
        echo "    🔒 Requires authentication (route exists)"
    elif [ "$response" = "400" ] || [ "$response" = "200" ]; then
        echo "    ✅ Route available"
    else
        echo "    ℹ️  Response code: $response"
    fi
done

echo ""
echo "=== API ENDPOINT TEST COMPLETED ==="
echo ""
echo "Notes:"
echo "- Routes returning 401/403 are working but require authentication"
echo "- Routes returning 400/200 are fully accessible"
echo "- Backend should be running on localhost:8080 for all tests to work"
echo ""
