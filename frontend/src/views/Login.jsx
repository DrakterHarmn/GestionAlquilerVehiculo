// src/views/Login.jsx
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import RegisterCliente from './RegisterCliente';

export default function Login() {
    const { login } = useAuth();

    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const [correo, setCorreo] = useState('');
    const [password, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoad] = useState(false);

    if (mostrarRegistro) {
        return <RegisterCliente volverLogin={() => setMostrarRegistro(false)} />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoad(true);

        try {
            await login(correo, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Correo o contraseña incorrectos.');
        } finally {
            setLoad(false);
        }
    };

    return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f4f0' }}>
            <div style={{ background:'#fff', padding:'2.5rem', borderRadius:16, boxShadow:'0 4px 24px rgba(0,0,0,0.10)', width:'100%', maxWidth:420 }}>

                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <h2 style={{ color:'#1a1a2e', margin:'0.5rem 0 0', fontSize:22 }}>
                        Gestión de Alquiler de Vehículos
                    </h2>
                </div>

                {error && (
                    <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1.25rem', fontSize:13 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom:'1rem' }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:5 }}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                            style={{ width:'100%', padding:'0.65rem 0.9rem', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom:'1.75rem' }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:5 }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPass(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width:'100%', padding:'0.65rem 0.9rem', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width:'100%', padding:'0.75rem', background: loading ? '#6b7280' : '#1a1a2e', color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer', transition:'background 0.2s' }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => setMostrarRegistro(true)}
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        padding: '0.75rem',
                        background: '#ff4d00',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Crear cuenta de cliente
                </button>

                <p style={{ textAlign:'center', color:'#d1d5db', fontSize:11, marginTop:'1.5rem' }}>
                    Autenticación segura con Laravel Sanctum
                </p>
            </div>
        </div>
    );
}