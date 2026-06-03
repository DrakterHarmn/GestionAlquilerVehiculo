import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../config/axios';
 
const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
    const [auth, setAuth]         = useState(null);
    const [cargando, setCargando] = useState(true);
 
    useEffect(() => {
        const token   = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');
        if (token && usuario) {
            setAuth(JSON.parse(usuario));
        }
        setCargando(false);
    }, []);
 
    const login = async (usuario, password) => {
        const { data } = await clienteAxios.post('/login', { usuario, password });
        localStorage.setItem('token',   data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setAuth(data.usuario);
        return data.usuario;
    };
 
    const logout = async () => {
        try { await clienteAxios.post('/logout'); } catch {}
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setAuth(null);
    };
 
    const esAdmin = () => auth?.rol === 'admin' || auth?.id_rol === 1;
 
    return (
        <AuthContext.Provider value={{ auth, cargando, login, logout, esAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
 
export default AuthContext;