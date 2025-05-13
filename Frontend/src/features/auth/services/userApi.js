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
export {
    loginUser,
    signupUser,
    updateUser,
};