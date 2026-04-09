/**
 * Central API configuration for the frontend.
 * Uses environment variables to switch between local development and production.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://e-com-platform-yq3h.onrender.com';

export const API_URL = API_BASE_URL;
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

export default API_URL;
