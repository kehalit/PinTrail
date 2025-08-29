import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL;



const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,// Handle successful responses
    async (error) => {
        const originalRequest = error.config;
        const msg = error.response?.data?.message;
        if (error.response.status === 401 && msg && msg.toLowerCase() === "token has expired" && !originalRequest._retry) {

        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });
            const newAccessToken = response.data.access_token;
            localStorage.setItem('access_token', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }

        catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);

}
)


export default api;