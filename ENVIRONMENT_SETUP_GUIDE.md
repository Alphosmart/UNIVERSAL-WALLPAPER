# 🔧 Environment Setup Guide

This guide will help you configure all necessary environment variables for production deployment.

## 🔐 Security Checklist

### ✅ **Completed (Already Configured)**
- [x] **JWT Secret**: Strong 32-byte random key generated
- [x] **MongoDB**: Connected to Atlas with proper credentials
- [x] **CORS**: Configured for frontend URL
- [x] **Authentication**: Bypass removed from middleware

### 🔧 **Requires Configuration**

#### **1. Cloudinary Setup (Image Upload)**
1. Sign up at [https://cloudinary.com](https://cloudinary.com)
2. Get your credentials from Dashboard
3. Update environment variables:

**Backend (.env):**
```bash
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_secret
```

**Frontend (.env):**
```bash
REACT_APP_CLOUD_NAME_CLOUDINARY=your_actual_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_actual_api_key
```

#### **2. Email Service Setup (Notifications)**
1. Enable 2FA on Gmail account
2. Generate App Password
3. Update backend .env:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=your_email@gmail.com
```

#### **3. Stripe Setup (Payments)**
1. Get keys from [https://stripe.com](https://stripe.com)
2. Update frontend .env:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key
```

#### **4. Production Environment Variables**

**Backend:**
```bash
NODE_ENV=production
PORT=8080
MONGODB_URI=your_production_mongodb_connection
TOKEN_SECRET_KEY=your_generated_secure_key
FRONTEND_URL=https://your-domain.com
```

**Frontend:**
```bash
REACT_APP_API_URL=https://your-api-domain.com
NODE_ENV=production
```

## 🚀 Deployment Checklist

### **Security**
- [ ] All placeholder values replaced with real credentials
- [ ] .env files added to .gitignore (✅ Done)
- [ ] Strong JWT secret key (✅ Done)
- [ ] HTTPS enabled in production
- [ ] CORS configured for production domain

### **Functionality**
- [ ] Cloudinary image upload tested
- [ ] Email notifications working
- [ ] Stripe payments functional
- [ ] Database migrations completed
- [ ] All API endpoints tested

### **Performance**
- [ ] Build optimization enabled
- [ ] Static assets compressed
- [ ] CDN configured for images
- [ ] Database indexes optimized
- [ ] Rate limiting implemented

## 🔍 Testing Commands

```bash
# Test database connection
npm run test:db

# Test email service  
npm run test:email

# Test image upload
npm run test:upload

# Full system test
npm run test:system
```

## 📋 Environment Template

Create a `.env.example` file with placeholder values:

```bash
# Copy this to .env and fill in actual values
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
TOKEN_SECRET_KEY=generate_32_byte_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_app_password
```

## 🆘 Troubleshooting

### **Common Issues:**
1. **Image Upload Fails**: Check Cloudinary credentials
2. **Email Not Sending**: Verify app password and 2FA
3. **Authentication Errors**: Regenerate JWT secret
4. **CORS Errors**: Update FRONTEND_URL in backend .env

### **Debug Mode:**
Set `NODE_ENV=development` to enable debug logging.
