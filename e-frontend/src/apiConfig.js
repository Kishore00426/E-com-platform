/**
 * Central API configuration for the frontend.
 * Uses environment variables to switch between local development and production.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4200';

export const API_URL = API_BASE_URL;
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

export default API_URL;
