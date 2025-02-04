import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../store/store';
// import AccessDenied from './AccessDenied';
// import { getUserTokens, removeTokens } from '../../utils/storage';
// import { useAppDispatch } from '../../store/hooks';
// import instance from '../../http/instance';
// import { logOut, setUserData } from '../../store/slices/userSlice';
// import { useEffect, useMemo } from 'react';
// import toast from 'react-hot-toast';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRoles?: string[];
// }

// export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
//   const userData = useSelector((state: RootState) => state.user.userData);
//   const location = useLocation();
//   const dispatch = useAppDispatch();

//   // `getUserTokens` çıktısını bir kez hesaplayarak referansı sabit tut
//   const tokens = useMemo(() => getUserTokens(), []);

//   const navigate = useNavigate();
//   const getUserData = async () => {
//     try {
//       const response = await instance.post('/user/me');
//       dispatch(setUserData(response.data));
//     } catch (error: any) {
//       removeTokens();
//       dispatch(logOut());
//       toast.error("Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.");
//       navigate('/');
//     }
//   };

//   useEffect(() => {
//     if (tokens) {
//       getUserData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (!tokens) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   if (requiredRoles && (!userData?.roles || !requiredRoles.some(role => userData.roles.includes(role)))) {
//     return <AccessDenied />;
//   }

//   return <>{children}</>;
// }
