import axios from "axios"
import { constant } from "../constant"

// Create an axios instance with default configuration
const api = axios.create({
    baseURL: constant.baseUrl,
    timeout: 15000, // 15 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject({ message: 'Server timeout. Please try again.' });
        }
        
        if (!error.response) {
            console.error('Network error', error);
            return Promise.reject({ message: 'Network error. Please check if the server is running.' });
        }
        
        return Promise.reject(error);
    }
);

export const postApi = async (path, data, login) => {
    try {
        console.log(`Making POST request to ${constant.baseUrl + path}`, { data, login });
        
        let result = await api.post(path, data);
        
        console.log(`Response from ${path}:`, result);
        
        if (result.data?.token && result.data?.token !== null) {
            if (login) {
                localStorage.setItem('token', result.data?.token);
                console.log('Token stored in localStorage');
            } else {
                sessionStorage.setItem('token', result.data?.token);
                console.log('Token stored in sessionStorage');
            }
            localStorage.setItem('user', JSON.stringify(result.data?.user));
            console.log('User stored in localStorage');
        }
        return result;
    } catch (e) {
        console.error(`Error in POST request to ${path}:`, e);
        throw e;
    }
}

export const putApi = async (path, data, id) => {
    try {
        let result = await api.put(path, data);
        return result;
    } catch (e) {
        console.error(`Error in PUT request to ${path}:`, e);
        throw e;
    }
}

export const deleteApi = async (path, param) => {
    try {
        let result = await api.delete(path + param);
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token);
        }
        return result;
    } catch (e) {
        console.error(`Error in DELETE request to ${path}:`, e);
        throw e;
    }
}

export const deleteManyApi = async (path, data) => {
    try {
        let result = await api.post(path, data);
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token);
        }
        return result;
    } catch (e) {
        console.error(`Error in DELETE MANY request to ${path}:`, e);
        throw e;
    }
}

export const getApi = async (path, id) => {
    try {
        if (id) {
            let result = await api.get(path + id);
            return result;
        } else {
            let result = await api.get(path);
            return result;
        }
    } catch (e) {
        console.error(`Error in GET request to ${path}:`, e);
        throw e;
    }
}

// Add a simple method to check server connectivity
export const checkServerStatus = async () => {
    try {
        const result = await api.get('/', { timeout: 5000 });
        return { 
            online: true,
            data: result.data
        };
    } catch (e) {
        console.error('Server status check failed:', e);
        return { 
            online: false,
            error: e.message || 'Could not connect to server'
        };
    }
}

