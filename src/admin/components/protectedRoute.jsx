/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';

export default function ProtectedRoute({ children }) {
    const admin = useAdminStore((state) => state.admin);

    if (!admin) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

