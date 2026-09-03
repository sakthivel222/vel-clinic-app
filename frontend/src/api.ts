const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
       localStorage.removeItem('token');
       window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'API Request failed');
  }

  return response.json();
};
