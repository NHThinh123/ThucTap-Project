import axios from "../../../services/axios.customize";

// API để đăng nhập
const loginUser = (data) => {
    const URL_API = "/api/users/login";
    return axios.post(URL_API, data);
};
const signupUser = (data) => {
    const URL_API = "/api/users/signup";
    return axios.post(URL_API, data);
};
const updateUser = (id, data) => {
    const URL_API = `/api/users/update/${id}`;
    return axios.put(URL_API, data, {
        headers: {
            "Content-Type":
                data instanceof FormData ? "multipart/form-data" : "application/json",
        },
    });
};

// API để yêu cầu đặt lại mật khẩu
const requestPasswordReset = (data) => {
    const URL_API = "/api/users/reset-password-request";
    return axios.post(URL_API, data);
};

// API để đặt lại mật khẩu
const resetPassword = (token, data) => {
    const URL_API = `/api/users/reset-password/${token}`;
    return axios.post(URL_API, data);
};

// API để lấy email từ token
const getEmailFromToken = (token) => {
    const URL_API = `/api/users/get-email/${token}`;
    return axios.get(URL_API);
};

// API để kiểm tra email có tồn tại không
const checkEmailExists = (email) => {
    const URL_API = "/api/users/check-email";
    return axios.post(URL_API, { email });
};

// API để đặt lại mật khẩu đơn giản
const resetPasswordSimple = (email, newPassword) => {
    const URL_API = "/api/users/reset-password-simple";
    return axios.post(URL_API, { email, newPassword });
};

export {
    loginUser,
    signupUser,
    updateUser,
    requestPasswordReset,
    resetPassword,
    getEmailFromToken,
    checkEmailExists,
    resetPasswordSimple,
};