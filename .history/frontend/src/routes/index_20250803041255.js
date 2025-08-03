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
import CartDebug from '../pages/CartDebug';
import SearchResults from '../pages/SearchResults';


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
                element: <Login />,
                errorElement: <ErrorPage />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
                errorElement: <ErrorPage />
            },
            {
                path: "reset-password",
                element: <ResetPassword />,
                errorElement: <ErrorPage />
            },
            {
                path: "sign-up",
                element: <SignUp />,
                errorElement: <ErrorPage />
            },
            {
                path: "profile",
                element: <Profile />,
                errorElement: <ErrorPage />
            },
            {
                path: "add-product",
                element: <AddProduct />,
                errorElement: <ErrorPage />
            },
            {
                path: "edit-product/:id",
                element: <EditProduct />,
                errorElement: <ErrorPage />
            },
            {
                path: "my-products",
                element: <MyProducts />,
                errorElement: <ErrorPage />
            },
            {
                path: "product/:id",
                element: <ProductDetail />,
                errorElement: <ErrorPage />
            },
            {
                path: "cart",
                element: <Cart />,
                errorElement: <ErrorPage />
            },
            {
                path: "checkout",
                element: <Checkout />,
                errorElement: <ErrorPage />
            },
            {
                path: "seller-account-settings",
                element: <SellerAccountSettings />,
                errorElement: <ErrorPage />
            },
            {
                path: "become-seller",
                element: <BecomeSellerPage />,
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
                element: <AdminPanel />,
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
                        path: "seller-applications",
                        element: <SellerApplications />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
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