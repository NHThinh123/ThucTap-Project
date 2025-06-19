import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { loginUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { App } from "antd";

export const useLogin = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (a) => loginUser(a),
    onSuccess: (data) => {
      if (data.status !== "SUCCESS") {
        message.error(data.message || "Đăng nhập thất bại!");
        return;
      }
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        user_name: data.user.user_name,
        avatar:
          data.user.avatar ||
          "https://res.cloudinary.com/nienluan/image/upload/v1741015659/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector_d3dgki.jpg",
        dateOfBirth: data.user.dateOfBirth,
        accessToken: data.user.accessToken,
        refreshToken: data.user.refreshToken,
        nickname: data.user.nickname,
      };

      localStorage.setItem("access_token", data.user.accessToken);
      localStorage.setItem("refresh_token", data.user.refreshToken);
      const authUser = {
        ...userData,
        accessToken: undefined,
        refreshToken: undefined,
      };
      localStorage.setItem("authUser", JSON.stringify(authUser));

      setAuth({ isAuthenticated: true, user: userData });

      message.success("Đăng nhập thành công!");

      // Điều hướng dựa trên vai trò
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "user") {
        navigate("/");
      } else {
        navigate("/profile");
      }

      console.log("User data saved:", userData);
    },
    onError: (error) => {
      message.error(error.message || "Đăng nhập thất bại!");
    },
  });
};
