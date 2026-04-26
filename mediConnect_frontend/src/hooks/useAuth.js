import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLE_ROUTES } from '../constants/roles';

/**
 * Custom hook for authentication
 * @returns {Object} Auth state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback((credentials) => {
    dispatch({ type: 'auth/loginRequest', payload: credentials });
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: 'auth/logoutRequest' });
    navigate('/login');
  }, [dispatch, navigate]);

  const register = useCallback((userData) => {
    dispatch({ type: 'auth/registerRequest', payload: userData });
  }, [dispatch]);

  const redirectToDashboard = useCallback(() => {
    if (user?.role) {
      const route = ROLE_ROUTES[user.role] || '/';
      navigate(route);
    }
  }, [user, navigate]);

  const hasPermission = useCallback((permission) => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const isRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    redirectToDashboard,
    hasPermission,
    isRole,
  };
};

export default useAuth;
