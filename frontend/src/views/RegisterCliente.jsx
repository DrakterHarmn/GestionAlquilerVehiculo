import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const inicial = {
    dni: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    usuario: '',
    password: '',
    licencia_conducir: '',
    fecha_vencimiento_licencia: '',
};

export default function RegisterCliente({ volverLogin }) {
    const { registerCliente } = useAuth();
    const [form, setForm] = useState(inicial);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setLoading(true);

        try {
            const data = await registerCliente(form);
            setMensaje(data.message || 'Cliente registrado correctamente.');
            setForm(inicial);
        } catch (err) {
            const errores = err.response?.data?.errors;
            setError(
                errores
                    ? Object.values(errores).flat()[0]
                    : err.response?.data?.message || 'Error al registrar cliente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const input = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: 10,
        fontSize: 14,
        boxSizing: 'border-box',
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fff7ed, #f5f4f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: '#fff',
                width: '100%',
                maxWidth: 760,
                padding: '2rem',
                borderRadius: 18,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            }}>
                <h2 style={{ margin: 0, color: '#ff4d00' }}>Crear cuenta de cliente</h2>
                <p style={{ color: '#6b7280' }}>Regístrate para reservar vehículos disponibles.</p>

                {mensaje && <div style={{ background:'#ecfdf5', color:'#16a34a', padding:'0.8rem', borderRadius:10, marginBottom:12 }}>✅ {mensaje}</div>}
                {error && <div style={{ background:'#fef2f2', color:'#dc2626', padding:'0.8rem', borderRadius:10, marginBottom:12 }}>❌ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem'
                    }}>
                        <input style={input} name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" required />
                        <input style={input} name="usuario" value={form.usuario} onChange={handleChange} placeholder="Usuario" required />

                        <input style={input} name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" required />
                        <input style={input} name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" required />

                        <input style={input} type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="Correo electrónico" required />
                        <input style={input} name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />

                        <input style={input} name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
                        <input style={input} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required />

                        <input style={input} name="licencia_conducir" value={form.licencia_conducir} onChange={handleChange} placeholder="Licencia de conducir" />
                        <input style={input} type="date" name="fecha_vencimiento_licencia" value={form.fecha_vencimiento_licencia} onChange={handleChange} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '0.9rem',
                            background: '#ff4d00',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <button
                    onClick={volverLogin}
                    style={{
                        marginTop: '1rem',
                        background: 'none',
                        border: 'none',
                        color: '#ff4d00',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Ya tengo cuenta, iniciar sesión
                </button>
            </div>
        </div>
    );
}