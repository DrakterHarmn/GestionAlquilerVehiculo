import { useState } from 'react';
import useAuth from '../hooks/useAuth';
 
export default function Login() {
    const { login } = useAuth();
    const [form,   setForm]   = useState({ usuario: '', password: '' });
    const [error,  setError]  = useState('');
    const [loading,setLoading]= useState(false);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await login(form.usuario, form.password);
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas.');
        } finally { setLoading(false); }
    };
 
    return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f4f0' }}>
            <div style={{ background:'#fff', padding:'2.5rem', borderRadius:16, boxShadow:'0 4px 24px rgba(0,0,0,0.10)', width:'100%', maxWidth:400 }}>
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <span style={{ fontSize:48 }}></span>
                    <h2 style={{ color:'#9ca3af', fontSize:14 }}>Gestión de Alquiler de Vehículos</h2>
                </div>
 
                {error && (
                    <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem', fontSize:14 }}>
                        ❌ {error}
                    </div>
                )}
 
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom:'1rem' }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 }}>Usuario</label>
                        <input
                            type="text" value={form.usuario} placeholder="Ingresa tu usuario"
                            onChange={e => setForm({...form, usuario: e.target.value})}
                            required
                            style={{ width:'100%', padding:'0.6rem 0.8rem', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom:'1.5rem' }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:4 }}>Contraseña</label>
                        <input
                            type="password" value={form.password} placeholder="••••••••"
                            onChange={e => setForm({...form, password: e.target.value})}
                            required
                            style={{ width:'100%', padding:'0.6rem 0.8rem', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        style={{ width:'100%', padding:'0.75rem', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:15, cursor:'pointer' }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}