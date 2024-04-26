import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, redirectTo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(redirectTo);
    }
  }, [isLoggedIn, navigate, redirectTo]);

  return <Outlet />;
};

export default ProtectedRoute;