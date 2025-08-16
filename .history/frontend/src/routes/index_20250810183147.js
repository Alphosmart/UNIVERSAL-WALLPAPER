import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home';
import Login from '../pages/Login';
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
import MyProducts from '../pages/MyProducts';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import SellerAccountSettings from '../pages/SellerAccountSettings';
import BecomeSellerPage from '../pages/BecomeSellerPage';
import SellerApplications from '../pages/SellerApplications';
import SellerDashboard from '../pages/SellerDashboard';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import SiteContentManagement from '../pages/SiteContentManagement';
import ShippingSettings from '../pages/ShippingSettings';
import BannerManagement from '../pages/BannerManagement';
import SellerOrders from '../pages/SellerOrders';
import OrderTracking from '../pages/OrderTracking';
import TrackByNumber from '../pages/TrackByNumber';
import MyOrders from '../pages/MyOrders';
import CartDebug from '../pages/CartDebug';
import SearchResults from '../pages/SearchResults';
import HelpCenter from '../pages/HelpCenter';
import HowToOrder from '../pages/HowToOrder';
import PaymentOptions from '../pages/PaymentOptions';
import TrackOrder from '../pages/TrackOrder';
import CancelOrder from '../pages/CancelOrder';
import ReturnsRefunds from '../pages/ReturnsRefunds';
import ContactUs from '../pages/ContactUs';
import { ProtectedRoute, GuestRoute, AdminRoute, SellerRoute } from '../components/AuthGuard';
import SellerProtectedRoute from '../components/SellerProtectedRoute';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Home />,
                errorElement: <ErrorPage />
            },
            {
                path: "login",
                element: <GuestRoute><Login /></GuestRoute>,
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
                element: <SellerProtectedRoute><AddProduct /></SellerProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "edit-product/:id",
                element: <ProtectedRoute><EditProduct /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "my-products",
                element: <SellerProtectedRoute><MyProducts /></SellerProtectedRoute>,
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
                path: "seller-account-settings",
                element: <SellerRoute><SellerAccountSettings /></SellerRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "seller-dashboard",
                element: <SellerRoute><SellerDashboard /></SellerRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "seller-orders",
                element: <SellerRoute><SellerOrders /></SellerRoute>,
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
                path: "become-seller",
                element: <ProtectedRoute><BecomeSellerPage /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "cart-debug",
                element: <CartDebug />,
                errorElement: <ErrorPage />
            },
            {
                path: "search",
                element: <SearchResults />,
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
                path: "returns-refunds",
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
                        path: "all-users", 
                        element: <AllUsers />
                    },
                    {
                        path: "banners",
                        element: <BannerManagement />
                    },
                    {
                        path: "seller-applications",
                        element: <SellerApplications />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
                    },
                    {
                        path: "shipping-settings",
                        element: <ShippingSettings />
                    },
                    {
                        path: "settings",
                        element: <Settings />
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