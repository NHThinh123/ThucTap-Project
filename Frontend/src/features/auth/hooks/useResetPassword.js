import { useMutation, useQuery } from "@tanstack/react-query";
import { requestPasswordReset, resetPassword, getEmailFromToken, checkEmailExists, resetPasswordSimple } from "../services/userApi";
import { App } from "antd";

// Hook để yêu cầu đặt lại mật khẩu
export const useRequestPasswordReset = () => {
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (email) => requestPasswordReset({ email }),
    onSuccess: () => {
      message.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      message.error(errorMessage);
    },
  });
};

// Hook để đặt lại mật khẩu
export const useResetPassword = () => {
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({ token, newPassword }) => resetPassword(token, { newPassword }),
    onSuccess: () => {
      message.success("Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập lại.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      message.error(errorMessage);
    },
  });
};

// Hook để lấy email từ token
export const useGetEmailFromToken = (token) => {
  return useQuery({
    queryKey: ["email", token],
    queryFn: () => getEmailFromToken(token),
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Hook để kiểm tra email có tồn tại không
export const useCheckEmailExists = () => {
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (email) => checkEmailExists(email),
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      message.error(errorMessage);
    },
  });
};

// Hook để đặt lại mật khẩu đơn giản
export const useResetPasswordSimple = () => {
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({ email, newPassword }) => resetPasswordSimple(email, newPassword),
    onSuccess: () => {
      message.success("Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập lại.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      message.error(errorMessage);
    },
  });
}; 