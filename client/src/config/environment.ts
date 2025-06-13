// Get the API URL from environment variables with a fallback
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Export other environment-specific configurations here
export const config = {
    apiUrl: API_URL
};
