import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Only allow if logged in and role is 'admin'
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // This will render the admin layout and sub-pages
};

export default AdminProtectedRoute;
