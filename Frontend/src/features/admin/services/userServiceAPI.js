import axios from "../../../services/axios.customize";

const fetchUsers = (params = {}) => {
  const URL_API = "/api/users/admin/list";
  return axios.get(URL_API, { params });
};

const fetchUserById = (id) => {
  const URL_API = `/api/users/admin/get-user/${id}`;
  return axios.get(URL_API);
};

const deleteUser = (id) => {
  const URL_API = `/api/users/admin/delete/${id}`;
  return axios.delete(URL_API);
};

const updateUser = (id, data) => {
  const URL_API = `/api/users/admin/update/${id}`;
  return axios.put(URL_API, data, {
    headers: {
      "Content-Type":
        data instanceof FormData ? "multipart/form-data" : "application/json",
    },
  });
};

export { fetchUsers, fetchUserById, deleteUser, updateUser };
