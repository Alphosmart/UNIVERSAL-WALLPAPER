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
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import ShippingSettings from '../pages/ShippingSettings';
import BannerManagement from '../pages/BannerManagement';
import SellerOrders from '../pages/SellerOrders';
import CartDebug from '../pages/CartDebug';
import SearchResults from '../pages/SearchResults';
import { ProtectedRoute, GuestRoute, AdminRoute, SellerRoute } from '../components/AuthGuard';


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
                element: <ProtectedRoute><AddProduct /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "edit-product/:id",
                element: <ProtectedRoute><EditProduct /></ProtectedRoute>,
                errorElement: <ErrorPage />
            },
            {
                path: "my-products",
                element: <ProtectedRoute><MyProducts /></ProtectedRoute>,
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