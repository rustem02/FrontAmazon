import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const StudentRoute = ({ children }) => {
  const { authTokens } = useContext(AuthContext);
  const profile = authTokens?.user;

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  const isAdminLike = profile.is_staff || profile.role === 'admin' || profile.role === 'dorm_staff';
  if (isAdminLike) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default StudentRoute;
