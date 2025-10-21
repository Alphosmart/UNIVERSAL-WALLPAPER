import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home';
import Login from '../pages/Login.jsx';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import ErrorPage from '../components/ErrorPage';
import AdminPanel from '../pages/AdminPanel';
import Dashboard from '../pages/Dashboard';
import AllProducts from '../pages/AllProducts';
import AllUsers from '../pages/AllUsers';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import CategoryManagement from '../pages/CategoryManagement';
import MyProducts from '../pages/MyProducts';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
// Seller routes removed - single company model
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import SiteContentManagement from '../pages/SiteContentManagement';
import BannerManagement from '../pages/BannerManagement';
import TestimonialsManagement from '../pages/TestimonialsManagement';
// SellerOrders removed - single company model
import OrderTracking from '../pages/OrderTracking';
import TrackByNumber from '../pages/TrackByNumber';
import MyOrders from '../pages/MyOrders';
import EnhancedSearchResults from '../pages/EnhancedSearchResults';
import HelpCenter from '../pages/HelpCenter';
import HowToOrder from '../pages/HowToOrder';
import PaymentOptions from '../pages/PaymentOptions';
import TrackOrder from '../pages/TrackOrder';
import CancelOrder from '../pages/CancelOrder';
import ReturnsRefunds from '../pages/ReturnsRefunds';
import ContactUs from '../pages/ContactUs';
import AboutUs from '../pages/AboutUs';
import LandingPage from '../pages/LandingPage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import ReturnRefundPolicy from '../pages/ReturnRefundPolicy';
import CookiePolicy from '../pages/CookiePolicy';
import AdminContactMessages from '../pages/AdminContactMessages';
import StaffManagement from '../pages/StaffManagement';
import EmailTemplateManager from '../components/EmailTemplateManager';
import PaymentConfiguration from '../pages/PaymentConfiguration';
import DevLogin from '../pages/DevLogin';
import { ProtectedRoute, GuestRoute, AdminRoute } from '../components/AuthGuard';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <LandingPage />,
                errorElement: <ErrorPage />
            },
            {
                path: 'home',
                element: <Home />,
                errorElement: <ErrorPage />
            },
            {
                path: "login",
                element: <GuestRoute><Login /></GuestRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "dev-login",
                element: <DevLogin />,
                errorElement: <ErrorPage />
            },
            {
                path: "forgot-password",
                element: <GuestRoute><ForgotPassword /></GuestRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "reset-password",
                element: <GuestRoute><ResetPassword /></GuestRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "sign-up",
                element: <GuestRoute><SignUp /></GuestRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "profile",
                element: <ProtectedRoute><Profile /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "add-product",
                element: <AdminRoute><AddProduct /></AdminRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "my-products",
                element: <AdminRoute><MyProducts /></AdminRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "product/:id",
                element: <ProductDetail />,
                errorElement: <ErrorPage />
            },
            {
                path: "cart",
                element: <ProtectedRoute><Cart /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "checkout",
                element: <ProtectedRoute><Checkout /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "order-tracking/:orderId",
                element: <ProtectedRoute><OrderTracking /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "track-order",
                element: <TrackByNumber />,
                errorElement: <ErrorPage />
            },
            {
                path: "my-orders",
                element: <ProtectedRoute><MyOrders /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "order-history",
                element: <ProtectedRoute><MyOrders /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            // {
            //     path: "become-seller",
            //     element: <ProtectedRoute><BecomeSellerPage /></ProtectedRoute>,
            //     errorElement: <ErrorPage />
            // },
            {
                path: "search",
                element: <EnhancedSearchResults />,
                errorElement: <ErrorPage />
            },
            {
                path: "help-center",
                element: <HelpCenter />,
                errorElement: <ErrorPage />
            },
            {
                path: "how-to-order",
                element: <HowToOrder />,
                errorElement: <ErrorPage />
            },
            {
                path: "payment-options",
                element: <PaymentOptions />,
                errorElement: <ErrorPage />
            },
            {
                path: "track-order",
                element: <TrackOrder />,
                errorElement: <ErrorPage />
            },
            {
                path: "cancel-order",
                element: <CancelOrder />,
                errorElement: <ErrorPage />
            },
            {
                path: "contact-us",
                element: <ContactUs />,
                errorElement: <ErrorPage />
            },
            {
                path: "about-us",
                element: <AboutUs />,
                errorElement: <ErrorPage />
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy />,
                errorElement: <ErrorPage />
            },
            {
                path: "terms-of-service",
                element: <TermsOfService />,
                errorElement: <ErrorPage />
            },
            {
                path: "return-refund-policy",
                element: <ReturnRefundPolicy />,
                errorElement: <ErrorPage />
            },
            {
                path: "cookie-policy",
                element: <CookiePolicy />,
                errorElement: <ErrorPage />
            },
            {
                path: "returns-refunds",
                element: <ReturnsRefunds />,
                errorElement: <ErrorPage />
            },
            {
                path: "returns-exchanges",
                element: <ReturnsRefunds />,
                errorElement: <ErrorPage />
            },
            {
                path: "analytics",
                element: <ProtectedRoute><Analytics /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "admin-panel",
                element: <AdminRoute><AdminPanel /></AdminRoute>,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    },
                    {
                        path: "add-product",
                        element: <AddProduct />
                    },
                    {
                        path: "categories",
                        element: <CategoryManagement />
                    },
                    {
                        path: "all-users", 
                        element: <AllUsers />
                    },
                    {
                        path: "staff-management",
                        element: <StaffManagement />
                    },
                    {
                        path: "contact-messages",
                        element: <AdminContactMessages />
                    },
                    {
                        path: "banners",
                        element: <BannerManagement />
                    },
                    {
                        path: "testimonials",
                        element: <TestimonialsManagement />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
                    },
                    {
                        path: "site-content",
                        element: <SiteContentManagement />
                    },
                    {
                        path: "email-templates",
                        element: <EmailTemplateManager />
                    },
                    {
                        path: "payment-config",
                        element: <PaymentConfiguration />
                    },
                    {
                        path: "settings",
                        element: <Settings />
                    },
                    {
                        path: "edit-product/:id",
                        element: <EditProduct />
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <ErrorPage />
    }
]);

export default router;