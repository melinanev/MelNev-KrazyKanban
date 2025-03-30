import { Navigate } from 'react-router-dom';
import Auth from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!Auth.loggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const token = Auth.getToken();
  if (token && Auth.isTokenExpired(token)) {
    Auth.logout();
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
