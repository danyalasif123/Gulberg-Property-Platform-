import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});


/*
=========================================
ADMIN AUTH TOKEN
=========================================
*/

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem(
        "adminToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/*
=========================================
HANDLE UNAUTHORIZED ADMIN SESSION
=========================================
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      sessionStorage.removeItem(
        "adminToken"
      );

      sessionStorage.removeItem(
        "admin"
      );
    }

    return Promise.reject(error);
  }
);


export default api;