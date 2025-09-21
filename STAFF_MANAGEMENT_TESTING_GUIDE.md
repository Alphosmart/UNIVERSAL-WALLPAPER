## Staff Management System - Testing Guide

### ✅ Issue Resolution

The error "Can't find /api/admin/grant-permissions on this server: http://localhost:3000/admin-panel/staff-management" has been **RESOLVED**.

**Root Cause:** The backend server needed to be restarted after we removed shipping functionality and added the new staff management APIs.

**Solution Applied:**
1. ✅ Fixed shipping model/controller references in backend
2. ✅ Restarted backend server successfully on port 8080  
3. ✅ New staff management APIs are now available

---

### 🔧 Current Status

**Backend Server:** ✅ Running on http://localhost:8080  
**Frontend Server:** ✅ Running on http://localhost:3000  
**Database:** ✅ MongoDB connected successfully  

**New API Endpoints Available:**
- `GET /api/admin/staff` - Get all staff members
- `GET /api/admin/all-users` - Get all users  
- `POST /api/admin/promote-to-admin` - Promote user to admin
- `PUT /api/admin/grant-permissions` - Grant staff permissions
- `GET /api/admin/staff/upload-stats` - Get upload statistics

---

### 🎯 How to Test Staff Management

#### Step 1: Access Admin Panel
1. Open browser to: http://localhost:3000
2. Login as an admin user
3. Navigate to **Admin Panel > Staff Management**

#### Step 2: Test Staff Promotion
1. Go to **"General Users"** tab
2. Find a regular user
3. Click **"Grant Permissions"** to give specific permissions
4. Or click **"Promote to Admin"** for full access

#### Step 3: Test Permission Management  
1. Go to **"All Staff"** tab
2. View current staff and their permissions
3. Click **"Edit Permissions"** to modify access

#### Step 4: View Upload Statistics
1. Go to **"Upload Statistics"** tab  
2. See who has uploaded products and activity levels

---

### 🔍 Test API Endpoints Directly

You can test the APIs using curl (requires admin authentication):

```bash
# Test staff endpoint (requires login)
curl -X GET http://localhost:8080/api/admin/staff \\
  -H "Content-Type: application/json" \\
  -H "Cookie: your-session-cookie"

# Test promote user (requires login + user ID)
curl -X POST http://localhost:8080/api/admin/promote-to-admin \\
  -H "Content-Type: application/json" \\
  -H "Cookie: your-session-cookie" \\
  -d '{"userId": "USER_ID_HERE"}'
```

---

### 📊 Features Available

✅ **User Role Management**
- Promote GENERAL users to STAFF role
- Promote GENERAL users to ADMIN role  
- View all staff members and their permissions

✅ **Permission Management**
- Grant/revoke product upload permissions
- Grant/revoke product edit permissions
- Grant/revoke product delete permissions
- Grant/revoke order management permissions

✅ **Product Upload Tracking**
- Track who uploaded each product
- View upload statistics by staff member
- Complete audit trail of all uploads

✅ **Admin Interface**
- User-friendly staff management dashboard
- Real-time permission management
- Upload statistics visualization

---

### 🚀 Next Steps

1. **Login as Admin:** Use existing admin credentials
2. **Access Staff Management:** Navigate to Admin Panel > Staff Management  
3. **Test Features:** Try promoting users and granting permissions
4. **Verify Tracking:** Upload a product and see tracking in action

The staff management system is now **fully functional** and ready for use!