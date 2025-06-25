// src/api/user.js
import api from './api';

export async function getProtectedData() {
    try {
        const response = await api.get('/users/protected'); 
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
        }
        throw error;
    }
}
