import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://college-department-management-systems.onrender.com/api/v1",
    // baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

export default axiosInstance;