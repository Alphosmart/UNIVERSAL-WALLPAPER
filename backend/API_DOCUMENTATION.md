# E-Commerce API Documentation

## Authentication Endpoints

### 1. User Registration
- **POST** `/api/signup`
- **Body**: `{ name, email, password }`
- **Response**: User registration confirmation

### 2. User Login
- **POST** `/api/signin`
- **Body**: `{ email, password }`
- **Response**: Authentication token (cookie)

### 3. Get User Details
- **GET** `/api/user-details`
- **Headers**: Authentication required
- **Response**: Current user information

### 4. User Logout
- **GET** `/api/userLogout`
- **Response**: Logout confirmation

## Product Management Endpoints

### 5. Get All Products
- **GET** `/api/get-product`
- **Query Params**: `category`, `status`, `search`
- **Response**: List of all available products

### 6. Add New Product (Sell)
- **POST** `/api/add-product`
- **Headers**: Authentication required
- **Body**: 
```json
{
  "productName": "iPhone 14 Pro",
  "brandName": "Apple",
  "category": "mobile",
  "productImage": ["image1.jpg", "image2.jpg"],
  "description": "Latest iPhone in excellent condition",
  "price": 80000,
  "sellingPrice": 75000,
  "stock": 1,
  "condition": "like-new",
  "location": "Mumbai, India",
  "tags": ["smartphone", "apple", "ios"]
}
```

### 7. Get User's Products
- **GET** `/api/user-products`
- **Headers**: Authentication required
- **Query Params**: `status`, `category`
- **Response**: List of products owned by the user

### 8. Update Product
- **PUT** `/api/update-product/:productId`
- **Headers**: Authentication required
- **Body**: Fields to update
- **Response**: Updated product information

### 9. Delete Product
- **DELETE** `/api/delete-product/:productId`
- **Headers**: Authentication required
- **Response**: Deletion confirmation

## Order/Purchase Endpoints

### 10. Buy Product
- **POST** `/api/buy-product`
- **Headers**: Authentication required
- **Body**:
```json
{
  "productId": "64f123456789abcdef123456",
  "quantity": 1,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "New York",
    "zipCode": "10001",
    "country": "United States"
  },
  "orderNotes": "Please handle with care"
}
```
**Note**: The system now supports 32+ countries including:
- **North America**: United States, Canada, Mexico
- **Europe**: United Kingdom, Germany, France, Italy, Spain
- **Asia**: India, China, Japan, South Korea, Thailand, Singapore
- **Middle East**: United Arab Emirates, Saudi Arabia
- **Africa**: Nigeria, South Africa, Egypt, Kenya, Ghana, Morocco, Ethiopia
- **Oceania**: Australia, New Zealand
- **South America**: Brazil, Argentina

Each country includes complete state/province data for accurate shipping addresses.

### 11. Get User Orders
- **GET** `/api/user-orders`
- **Headers**: Authentication required
- **Query Params**: 
  - `type`: "buying" (default) or "selling"
  - `status`: "pending", "confirmed", "shipped", "delivered", "cancelled"
- **Response**: List of user's orders

### 12. Update Order Status
- **PUT** `/api/update-order-status/:orderId`
- **Headers**: Authentication required
- **Body**: `{ "orderStatus": "shipped", "paymentStatus": "completed" }`
- **Response**: Updated order information

## Data Models

### Product Schema
```javascript
{
  productName: String,
  brandName: String,
  category: String,
  productImage: Array,
  description: String,
  price: Number,
  sellingPrice: Number,
  seller: ObjectId (User),
  sellerInfo: { name, email },
  stock: Number,
  condition: Enum ['new', 'like-new', 'good', 'fair', 'poor'],
  status: Enum ['available', 'sold', 'pending'],
  location: String,
  tags: Array,
  timestamps: true
}
```

### Order Schema
```javascript
{
  buyer: ObjectId (User),
  seller: ObjectId (User),
  product: ObjectId (Product),
  productDetails: Object,
  quantity: Number,
  totalAmount: Number,
  orderStatus: Enum ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  paymentStatus: Enum ['pending', 'completed', 'failed'],
  shippingAddress: Object,
  buyerInfo: Object,
  orderNotes: String,
  timestamps: true
}
```

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  profilePic: String,
  phone: String,
  address: Object,
  role: Enum ['GENERAL', 'ADMIN'],
  timestamps: true
}
```

## Usage Examples

### Adding a Product for Sale
```javascript
const response = await fetch('/api/add-product', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Cookie with auth token automatically included
  },
  body: JSON.stringify({
    productName: "MacBook Pro M2",
    brandName: "Apple",
    category: "laptop",
    description: "Barely used MacBook Pro with M2 chip",
    price: 150000,
    sellingPrice: 140000,
    condition: "like-new",
    location: "Delhi, India"
  })
});
```

### Buying a Product
```javascript
const response = await fetch('/api/buy-product', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: "64f123456789abcdef123456",
    quantity: 1,
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India"
    }
  })
});
```

## Error Handling

All endpoints return standardized error responses:
```json
{
  "message": "Error description",
  "error": true,
  "success": false
}
```

## Success Responses

All endpoints return standardized success responses:
```json
{
  "message": "Operation successful",
  "data": {},
  "error": false,
  "success": true
}
```
