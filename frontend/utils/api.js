// frontend/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper fetch avec gestion d'erreurs
const fetchAPI = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Pour envoyer les cookies de session
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const login = async (email, password) => {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (userData) => {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logout = async () => {
  return fetchAPI('/auth/logout', {
    method: 'POST',
  });
};

export const checkAuth = async () => {
  return fetchAPI('/auth/me');
};

// Settings API
export const fetchSettings = async () => {
  return fetchAPI('/settings');
};

export const fetchSetting = async (key) => {
  return fetchAPI(`/settings/${key}`);
};

// Dishes API
export const fetchDishes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/dishes${queryString ? `?${queryString}` : ''}`);
};

export const fetchDishById = async (id) => {
  return fetchAPI(`/dishes/${id}`);
};

export const searchDishes = async (query) => {
  return fetchAPI(`/dishes/search?q=${encodeURIComponent(query)}`);
};

// Categories API
export const fetchCategories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/categories${queryString ? `?${queryString}` : ''}`);
};

export const fetchCategoryById = async (id) => {
  return fetchAPI(`/categories/${id}`);
};

export const fetchDishesByCategory = async (categoryId) => {
  return fetchAPI(`/categories/${categoryId}/dishes`);
};

// Menus API
export const fetchMenus = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/menus${queryString ? `?${queryString}` : ''}`);
};

export const fetchMenuById = async (id) => {
  return fetchAPI(`/menus/${id}`);
};

// Reservations API
export const createReservation = async (reservationData) => {
  return fetchAPI('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  });
};

export const fetchUserReservations = async () => {
  return fetchAPI('/reservations/my');
};

export const cancelReservation = async (id) => {
  return fetchAPI(`/reservations/${id}/cancel`, {
    method: 'PUT',
  });
};

// Favorites API
export const fetchFavorites = async () => {
  return fetchAPI('/favorites');
};

export const addFavorite = async (dishId) => {
  return fetchAPI('/favorites', {
    method: 'POST',
    body: JSON.stringify({ dishId }),
  });
};

export const removeFavorite = async (dishId) => {
  return fetchAPI(`/favorites/${dishId}`, {
    method: 'DELETE',
  });
};

// User API
export const updateProfile = async (userData) => {
  return fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const changePassword = async (oldPassword, newPassword) => {
  return fetchAPI('/users/password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};