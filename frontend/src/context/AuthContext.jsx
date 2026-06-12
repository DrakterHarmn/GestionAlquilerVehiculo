// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth,     setAuth]     = useState(null);
    const [cargando, setCargando] = useState(true);

    // Al cargar la app, recuperar sesión guardada
    useEffect(() => {
        const token   = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');
        if (token && usuario) {
            setAuth(JSON.parse(usuario));
        }
        setCargando(false);
    }, []);

    // Login con correo y contraseña → recibe token Sanctum
    const login = async (correo, password) => {
        const { data } = await clienteAxios.post('/login', { correo, password });

        // Guardar token en localStorage para peticiones futuras
        localStorage.setItem('token',   data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        setAuth(data.usuario);
        return data.usuario;
    };

    // Logout → invalida token en el servidor
    const logout = async () => {
        try {
            await clienteAxios.post('/logout');
        } catch {}
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setAuth(null);
    };

    const esAdmin = () => auth?.rol === 'admin' || auth?.id_rol === 1;

    const registerCliente = async (form) => {
        const { data } = await clienteAxios.post('/register-cliente', form);
        return data;
    };

    return (
        <AuthContext.Provider value={{ auth, cargando, login, logout, esAdmin, registerCliente }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;