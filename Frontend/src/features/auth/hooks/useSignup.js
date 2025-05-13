import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import { App } from "antd";


export const useSignup = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    return useMutation({
        mutationFn: async (userData) => {
            const payload = { ...userData, role: "user" };
            const response = await signupUser(payload);
            return response;
        },
        onSuccess: (response) => {


            if (response && response.status === "PENDING") {
                // Đảm bảo message hiển thị trước khi redirect
                message.success({
                    content: "Đăng ký tài khoản thành công!",
                    duration: 2,
                    onClose: () => {
                        navigate("/login")
                    }
                });
            } else if (response?.message === "Email already exists") {
                message.error("Email đã tồn tại. Vui lòng sử dụng email khác!");
            } else {
                message.error("Đăng ký thất bại. Vui lòng thử lại!");
            }
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message;
            console.error("Signup error:", error); // Log để debug

            if (errorMessage === "Email already exists") {
                message.error("Email đã tồn tại. Vui lòng sử dụng email khác!");
            } else {
                message.error("Đăng ký thất bại. Vui lòng thử lại!");
            }
        },
    });
};
