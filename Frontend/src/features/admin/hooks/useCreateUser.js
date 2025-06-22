import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { createUser } from "../services/userServiceAPI";

const useCreateUser = (form, onSuccess, onClose) => {
  const { message } = App.useApp();
  return useMutation({
    mutationFn: (data) => {
      // Đảm bảo dữ liệu không chứa undefined
      const sanitizedData = {
        user_name: data.user_name?.trim() || "",
        email: data.email?.trim() || "",
        password: data.password || "",
        nickname: data.nickname?.trim() || "",
        dateOfBirth: data.dateOfBirth || null,
        role: data.role || "user",
      };
      return createUser(sanitizedData);
    },
    onSuccess: () => {
      message.success("Tạo người dùng thành công");
      form.resetFields();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng"
      );
    },
  });
};

export default useCreateUser;
