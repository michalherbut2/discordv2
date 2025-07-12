// import { useEffect } from 'react';
// import { useAuthStore } from '@/store/useAuthStore';
// import { getCurrentUser } from '@/services/auth.service';

// export const useAuth = () => {
//   const { token, user, setUser, logout } = useAuthStore();

//   useEffect(() => {
//     if (token && !user) {
//       getCurrentUser()
//         .then(setUser)
//         .catch(() => logout());
//     }
//   }, [token]);

//   return {
//     user,
//     token,
//     isAuthenticated: !!token && !!user,
//     logout,
//   };
// };

import { useEffect } from 'react';
import { useAuthStore } from '@/features/Auth/stores/useAuthStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  };
};
