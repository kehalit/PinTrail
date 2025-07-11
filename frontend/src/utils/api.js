import axios from 'axios';

// Create an instance of axios with default settings
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000', 
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
        if(error.response.status === 401 && error.response.data.message.toLowerCase() === 'token has expired' && !originalRequest._retry){
            originalRequest._retry = true;
            try{
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post('http://127.0.0.1:5000/refresh', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}`}
                });
                const newAccessToken = response.data.access_token;
                localStorage.setItem('access_token', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
        
        catch(refreshError){
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);

}
)

    
export default api;