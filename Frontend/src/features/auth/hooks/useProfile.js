import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/userApi";
import { App } from "antd";

export const useUpdateProfile = (options = {}) => {
    const { message } = App.useApp();
    return useMutation({
        mutationFn: async (variables) => {
            const { id, data } = variables;
            const response = await updateUser(id, data); // Gọi API


            // Kiểm tra phản hồi từ backend
            if (response?.error) {
                // Nếu backend trả về object có trường "error", ném lỗi
                throw new Error(response.error);
            }

            // Nếu không có lỗi, trả về dữ liệu
            return response;
        },
        onError: (error) => {
            // Xử lý lỗi từ mutationFn
            const errorMessage = error.message;
            if (errorMessage === "Mật khẩu cũ không đúng!") {
                message.error("Mật khẩu cũ không chính xác, vui lòng kiểm tra lại!");
            } else {
                message.error("Cập nhật thất bại, vui lòng thử lại!");
            }
            console.error("Update profile error:", error);
            options.onError?.(error); // Gọi callback nếu có
        },
        onSuccess: (data) => {
            message.success("Cập nhật thông tin thành công!");
            options.onSuccess?.(data); // Gọi callback nếu có
        },
    });
};