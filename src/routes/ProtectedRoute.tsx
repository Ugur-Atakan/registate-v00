import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AccessDenied from '../pages/AccessDenied';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logOut, setUserData } from '../store/slices/userSlice';
import instance from '../http/instance';
import { getUserTokens, removeTokens } from '../utils/storage';
import { setCompanies } from '../store/slices/companySlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const userData = useAppSelector((state) => state.user.userData);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // `getUserTokens` çıktısını bir kez hesaplayarak referansı sabit tut
  const tokens = useMemo(() => getUserTokens(), []);

  const navigate = useNavigate();
  const getUserData = async () => {
    try {
      setLoading(true);
      const response = await instance.post('/user/me');
      console.log('User data:', response.data);
      dispatch(setUserData(response.data));
      dispatch(setCompanies(response.data.companies));
      setLoading(false);
    } catch (error: any) {
      removeTokens();
      dispatch(logOut());
      toast.error("Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.");
      navigate('/');
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokens) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tokens) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (loading) {
    return <p>Loading</p>;
  }
  if (requiredRoles && (!userData?.roles || !requiredRoles.some(role => userData.roles.includes(role)))) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
