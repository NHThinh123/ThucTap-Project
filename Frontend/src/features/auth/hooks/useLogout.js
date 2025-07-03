import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/auth.context";
import { App } from "antd";

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const logout = (redirectPath = "/") => {
    setIsLoggingOut(true);
    
    try {
      // Hiển thị thông báo loading
      const hide = message.loading("Đang đăng xuất...", 0);
      
      setTimeout(() => {
        // Clear auth state
        setAuth({ isAuthenticated: false, user: {} });
        
        // Clear localStorage
        localStorage.removeItem("authUser");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        
        // Hide loading message
        hide();
        
        // Show success message
        message.success("Đăng xuất thành công!");
        
        setIsLoggingOut(false);
        
        // Navigate to redirect path
        navigate(redirectPath);
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Có lỗi xảy ra khi đăng xuất!");
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut,
  };
}; 