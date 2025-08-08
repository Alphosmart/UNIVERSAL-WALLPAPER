import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ErrorPage from '../components/ErrorPage';


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
                path: "sign-up",
                element: <SignUp />,
                errorElement: <ErrorPage />
            },
        ]
    },
    {
        path: "*",
        element: <ErrorPage />
    }
]);

export default router;