# 💳 Multi-Vendor Payment System Documentation

## 🎯 **Overview**

This system allows multiple sellers to receive payments directly to their accounts when customers purchase their products. The platform handles split payments, commissions, and seller verification.

## 🏦 **Where Sellers Add Their Account Details**

### **1. Seller Account Settings Page**
**URL:** `/seller-account-settings`

Sellers can access this page to:
- Add bank account information
- Set up PayPal payments
- Upload verification documents
- Configure payout preferences

### **2. Account Information Required**

#### **Bank Account Details:**
- Account Holder Name
- Bank Name  
- Account Number (secured/masked)
- Routing Number (9 digits)
- Account Type (Checking/Savings)

#### **PayPal Integration:**
- PayPal Email Address
- Verified PayPal account

#### **Tax Information:**
- SSN (last 4 digits for security)
- EIN (for business accounts)
- Business Type (individual/company/non_profit)

#### **Verification Documents:**
- Government ID (Driver's License/Passport)
- Address Proof (Utility bill/Bank statement)
- Bank Statement (last 3 months)

## 🔄 **How the Payment Flow Works**

### **1. Customer Checkout Process**
```
Customer adds items to cart → 
Proceeds to checkout → 
Enters payment information → 
Completes payment
```

### **2. Split Payment Processing**
```
Total payment received → 
Platform commission deducted (3%) → 
Remaining amount split by seller → 
Automatic payouts to verified sellers → 
Pending payouts for unverified sellers
```

### **3. Seller Verification Flow**
```
Seller uploads documents → 
Admin reviews documents → 
Documents approved/rejected → 
Seller receives verification status → 
Verified sellers receive automatic payouts
```

## 💰 **Commission & Fee Structure**

### **Platform Commission: 3%**
- Deducted from each sale
- Goes to platform revenue
- Clearly shown in seller dashboard

### **Payment Processing Fees: 2.9% + $0.30**
- Stripe processing fees
- Deducted from platform commission
- Transparent fee structure

### **Example Calculation:**
```
Product Price: $100.00
Platform Commission (3%): $3.00
Seller Receives: $97.00
Platform Revenue: $3.00
Stripe Fees (from platform): $3.20
Platform Net: -$0.20 (on small transactions)
```

## 🛠 **Implementation Details**

### **Database Schema Changes**

#### **User Model Enhanced:**
```javascript
paymentDetails: {
  bankAccount: {
    accountNumber: String,
    routingNumber: String,
    accountHolderName: String,
    bankName: String,
    accountType: String
  },
  stripeAccountId: String,
  paypalEmail: String,
  isVerified: Boolean,
  verificationDocuments: [...]
}
```

#### **Order Model Enhanced:**
```javascript
totalAmount: Number,
platformCommission: Number,
sellerAmount: Number,
paymentId: String
```

### **API Endpoints**

#### **Seller Management:**
- `GET /api/seller-payment-details` - Get seller account info
- `PUT /api/seller-payment-details` - Update account info
- `POST /api/seller-document-upload` - Upload verification docs

#### **Admin Management:**
- `PUT /api/admin/verify-seller-document` - Verify documents
- `GET /api/admin/sellers-payment-details` - View all sellers

#### **Split Payments:**
- `POST /api/buy-multiple-products-split` - Process split payments

## 🔐 **Security Features**

### **Data Protection:**
- Bank account numbers are masked in UI
- Sensitive data encrypted in database
- Secure file upload for documents
- PCI compliance through Stripe

### **Verification Process:**
- Document upload and review
- Identity verification required
- Address verification required
- Bank account verification

### **Access Controls:**
- Authentication required for all operations
- Role-based access (seller vs admin)
- Rate limiting on sensitive endpoints

## 📱 **User Interface Features**

### **Seller Dashboard:**
- Payment settings management
- Document upload interface
- Verification status tracking
- Payout history and scheduling

### **Admin Panel:**
- Seller verification queue
- Document review interface
- Payout management
- Commission tracking

### **Customer Experience:**
- Transparent split payment process
- Order tracking by seller
- Clear receipt breakdown

## 🚀 **Setup Instructions**

### **1. Environment Variables**
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Frontend URL for redirects
FRONTEND_URL=https://yourdomain.com
```

### **2. Install Dependencies**
```bash
# Backend
npm install stripe multer

# Frontend - already installed
@stripe/stripe-js @stripe/react-stripe-js
```

### **3. File Upload Configuration**
```javascript
// Create uploads directory
mkdir -p uploads/seller-documents

// Set proper permissions
chmod 755 uploads/seller-documents
```

### **4. Stripe Connect Setup**
1. Enable Stripe Connect in your Stripe Dashboard
2. Configure application fee percentage
3. Set up webhooks for payout notifications
4. Configure Express or Custom accounts

## 📋 **Seller Onboarding Process**

### **Step 1: Account Creation**
- Seller signs up as regular user
- Accesses seller settings page
- Begins verification process

### **Step 2: Information Collection**
- Basic business information
- Tax identification details
- Bank account or PayPal setup

### **Step 3: Document Upload**
- Government-issued ID
- Proof of address
- Bank statement verification

### **Step 4: Admin Review**
- Documents reviewed by admin
- Verification status updated
- Seller notified of approval/rejection

### **Step 5: Account Activation**
- Verified sellers can receive payouts
- Automatic payment processing enabled
- Seller dashboard access granted

## 🔧 **Payout Configuration**

### **Payout Schedules:**
- **Daily:** Next business day
- **Weekly:** Every Friday
- **Monthly:** 1st of each month

### **Minimum Payout Amounts:**
- Default: $25.00
- Configurable by seller
- Prevents micro-transactions

### **Payout Methods:**
- Direct bank transfer (ACH)
- PayPal payments
- International wire transfers

## 📊 **Reporting & Analytics**

### **Seller Dashboard:**
- Total earnings
- Commission breakdown
- Payout history
- Order analytics

### **Admin Dashboard:**
- Platform revenue
- Seller performance
- Verification queue
- Payout summaries

### **Financial Reports:**
- Monthly revenue reports
- Commission tracking
- Tax reporting assistance
- Seller statements

## 🛡 **Compliance & Legal**

### **Tax Compliance:**
- 1099 form generation
- Tax ID collection
- State tax compliance
- International tax considerations

### **Financial Regulations:**
- KYC (Know Your Customer) compliance
- AML (Anti-Money Laundering) checks
- PCI DSS compliance
- Data protection regulations

### **Terms of Service:**
- Seller agreement terms
- Commission structure disclosure
- Payout terms and conditions
- Dispute resolution process

## 🆘 **Troubleshooting Common Issues**

### **Seller Account Issues:**
- **Verification Pending:** Check document upload status
- **Payout Delays:** Verify bank account details
- **Commission Questions:** Review fee structure

### **Technical Issues:**
- **Upload Failures:** Check file size and format
- **API Errors:** Verify authentication tokens
- **Payout Failures:** Check Stripe account status

### **Admin Support:**
- Document verification queue
- Seller support tickets
- Payment dispute resolution
- Account suspension/activation

## 🔄 **Future Enhancements**

### **Planned Features:**
- [ ] Cryptocurrency payments
- [ ] International seller support
- [ ] Advanced analytics dashboard
- [ ] Mobile app for sellers
- [ ] Automated tax reporting
- [ ] Seller subscription tiers

### **Integration Opportunities:**
- [ ] QuickBooks integration
- [ ] Shopify seller import
- [ ] Amazon seller onboarding
- [ ] Social media integration
- [ ] Email marketing tools

---

## 🎯 **Quick Setup Checklist for Sellers**

1. ✅ **Access Settings:** Go to `/seller-account-settings`
2. ✅ **Add Bank Details:** Complete bank account information
3. ✅ **Upload Documents:** Submit required verification docs
4. ✅ **Wait for Approval:** Admin reviews within 2-3 business days
5. ✅ **Start Selling:** Receive automatic payouts once verified

**The multi-vendor payment system is now ready to handle complex seller payouts automatically! 🎉**
