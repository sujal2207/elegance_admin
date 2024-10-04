import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://elegance-backend-haqu.onrender.com/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = JSON.parse(sessionStorage.getItem('token'));
        console.log(token)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;