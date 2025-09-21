# MERN Marketplace - Multi-Vendor E-commerce Platform

A comprehensive three-user marketplace built with the MERN stack (MongoDB, Express.js, React, Node.js) supporting buyers, sellers, and shipping companies.

## 🚀 Features

### For Buyers
- **Product Browsing**: Browse products by category with advanced filtering
- **Shopping Cart**: Add products to cart with real-time updates
- **Order Management**: Place orders, track status, and view order history
- **Payment Integration**: Secure payment processing with Stripe
- **Order Tracking**: Real-time tracking with multiple status updates
- **Review System**: Rate and review products and orders
- **Social Features**: Like and share products on social media

### For Sellers
- **Product Management**: Add, edit, and manage product listings
- **Order Processing**: View and manage incoming orders
- **Inventory Tracking**: Monitor stock levels and product performance
- **Sales Analytics**: Dashboard with sales statistics and insights
- **Order Status Updates**: Update order status with tracking information
- **Revenue Tracking**: Monitor earnings and payment status

### For Shipping Companies
- **Company Registration**: Register and verify shipping company accounts
- **Service Area Management**: Define operational regions for order matching
- **Order Quotes**: Submit competitive quotes for available orders
- **Quote Management**: Track submitted quotes and their status
- **Dashboard Analytics**: View performance metrics and statistics

### Admin Panel
- **User Management**: Manage buyers, sellers, and shipping companies
- **Order Oversight**: Monitor all platform orders and transactions
- **Content Management**: Manage site banners, categories, and content
- **Analytics Dashboard**: Platform-wide statistics and insights
- **System Settings**: Configure platform settings and parameters

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Redux Toolkit**: State management for complex application state
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Icons**: Comprehensive icon library
- **React Toastify**: Toast notifications for user feedback
- **Recharts**: Charts and data visualization

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for building REST APIs
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and security
- **Cloudinary**: Image upload and management service
- **Stripe**: Payment processing integration

### Development Tools
- **Nodemon**: Development server with auto-restart
- **CORS**: Cross-origin resource sharing configuration
- **Cookie Parser**: HTTP cookie parsing middleware

## 📁 Project Structure

```
MERN/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store configuration
│   │   ├── helpers/         # Utility functions
│   │   └── common/          # API endpoints and constants
├── backend/                 # Node.js backend application
│   ├── controller/          # Request handlers and business logic
│   ├── models/              # MongoDB data models
│   ├── routes/              # API route definitions
│   ├── middleware/          # Custom middleware functions
│   └── config/              # Database and app configuration
└── documentation/           # Setup and deployment guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alphosmart/MERN.git
   cd MERN
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env` in the backend directory
   - Copy `.env.example` to `.env` in the frontend directory
   - Configure your environment variables (see Environment Setup Guide)

5. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
TOKEN_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📚 Documentation

- [Environment Setup Guide](ENVIRONMENT_SETUP_GUIDE.md) - Detailed setup instructions
- [Production Deployment Checklist](PRODUCTION_DEPLOYMENT_CHECKLIST.md) - Deployment guide
- [Cloudinary Setup Guide](CLOUDINARY_SETUP_GUIDE.md) - Image upload configuration
- [Database Implementation Summary](DATABASE_IMPLEMENTATION_SUMMARY.md) - Database schema details

## 🎯 Key Features Implemented

### Multi-User Authentication
- Role-based access control (Buyer, Seller, Shipping Company, Admin)
- JWT-based authentication with secure cookie storage
- Protected routes and middleware authorization

### E-commerce Functionality
- Complete product catalog with categories and search
- Shopping cart with persistent storage
- Order management with multiple status tracking
- Payment integration with Stripe
- Real-time inventory management

### Shipping Integration
- Three-way marketplace with dedicated shipping companies
- Service area-based order matching
- Competitive quote submission system
- Automated order routing and tracking

### Advanced Features
- Social media integration (Instagram, WhatsApp sharing)
- Review and rating system
- Advanced analytics and reporting
- Responsive design for all devices
- Real-time notifications and updates

## 🚢 Deployment

The application is ready for production deployment. See the [Production Deployment Checklist](PRODUCTION_DEPLOYMENT_CHECKLIST.md) for detailed instructions.

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or similar
- **Backend**: Heroku, DigitalOcean, or AWS
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation guides
- Review the implementation summaries

## 🏆 Acknowledgments

- Built with modern MERN stack best practices
- Implements comprehensive e-commerce functionality
- Supports multi-vendor marketplace operations
- Includes advanced shipping and logistics features
