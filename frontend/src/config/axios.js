import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
    },
});

// Inyecta el token automáticamente en cada petición
clienteAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Si se envía FormData, dejar que el navegador coloque el boundary correcto.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

// Si el token expira redirige al login
clienteAxios.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }

        return Promise.reject(err);
    }
);

export default clienteAxios;
