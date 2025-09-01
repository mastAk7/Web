import axios from 'axios';

// Create API client with proper configuration
// Using relative URLs since vite proxy handles the backend routing
const api = axios.create({ 
    baseURL: '', // Empty baseURL to use relative paths with vite proxy
    withCredentials: true,
    timeout: 30000
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
        }
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        throw error;
    }
);

// THI Analysis API
export async function analyze({ response_text, optional_context = [] }) {
    try {
        const { data } = await api.post('/api/analyze/thi', { 
            response_text, 
            optional_context 
        });
        return data;
    } catch (error) {
        console.error('Analysis API error:', error);
        throw error;
    }
}

// Health check API
export async function checkHealth() {
    try {
        const { data } = await api.get('/health');
        return data;
    } catch (error) {
        console.error('Health check error:', error);
        throw error;
    }
}

// Check if backend is available
export async function isBackendAvailable() {
    try {
        await checkHealth();
        return true;
    } catch {
        return false;
    }
}

// Export the configured API client
export { api };