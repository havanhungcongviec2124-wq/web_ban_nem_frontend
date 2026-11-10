import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, getMe } from '../redux/auth/AuthApi';
import { logout as logoutAction, clearAuthError } from '../redux/auth/AuthSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAdmin, isLoading, error } = useSelector((state) => state.auth);

  // Khi tải ứng dụng, tự động kiểm tra phiên đăng nhập với token hiện có
  useEffect(() => {
    const token = localStorage.getItem('nep_token');
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        return { success: true, user: resultAction.payload.user };
      }
      return {
        success: false,
        message: resultAction.payload || 'Đăng nhập không thành công',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Lỗi kết nối máy chủ backend!',
      };
    }
  };

  const register = async ({ name, email, phone = '', password, role = 'user' }) => {
    try {
      const resultAction = await dispatch(registerUser({ name, email, phone, password, role }));
      if (registerUser.fulfilled.match(resultAction)) {
        return { success: true, user: resultAction.payload.user };
      }
      return {
        success: false,
        message: resultAction.payload || 'Đăng ký không thành công',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Lỗi kết nối máy chủ backend!',
      };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError: () => dispatch(clearAuthError()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
