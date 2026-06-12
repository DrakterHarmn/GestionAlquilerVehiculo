// src/views/Cliente.jsx
import { useCliente } from '../hooks/useCliente';

export function ClientesView() {
    const {
        clientes, form, modoEdicion, alerta,
        handleInputChange, resetForm,
        crearCliente, editarCliente, actualizarCliente, desactivarCliente
    } = useCliente();

    const inp = {
        width: '100%', padding: '0.55rem 0.75rem',
        border: '1px solid #d1d5db', borderRadius: 8,
        fontSize: 13, boxSizing: 'border-box'
    };
    const lbl = {
        display: 'block', fontSize: 12, fontWeight: 600,
        color: '#6b7280', textTransform: 'uppercase', marginBottom: 3
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem' }}>

            {/* ── Formulario ── */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', alignSelf: 'start' }}>
                <h3 style={{ color: '#1a1a2e', marginTop: 0 }}>
                    {modoEdicion ? ' Editar Cliente' : ' Registrar Cliente'}
                </h3>

                {alerta.msg && (
                    <div style={{
                        padding: '0.65rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: 13,
                        background: alerta.error ? '#fef2f2' : '#f0fdf4',
                        color:      alerta.error ? '#dc2626' : '#16a34a',
                        border:     `1px solid ${alerta.error ? '#fecaca' : '#bbf7d0'}`
                    }}>
                        {alerta.error ? '❌' : '✅'} {alerta.msg}
                    </div>
                )}

                <form onSubmit={modoEdicion ? actualizarCliente : crearCliente}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>

                        {/* DNI solo en modo creación */}
                        {!modoEdicion && (
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={lbl}>DNI *</label>
                                <input style={inp} type="text" name="dni" value={form.dni}
                                    onChange={handleInputChange} required maxLength={15} placeholder="12345678" />
                            </div>
                        )}

                        <div>
                            <label style={lbl}>Nombres *</label>
                            <input style={inp} type="text" name="nombres" value={form.nombres}
                                onChange={handleInputChange} required placeholder="Juan" />
                        </div>
                        <div>
                            <label style={lbl}>Apellidos *</label>
                            <input style={inp} type="text" name="apellidos" value={form.apellidos}
                                onChange={handleInputChange} required placeholder="Pérez" />
                        </div>
                        <div>
                            <label style={lbl}>Teléfono</label>
                            <input style={inp} type="text" name="telefono" value={form.telefono}
                                onChange={handleInputChange} placeholder="987654321" />
                        </div>
                        <div>
                            <label style={lbl}>Correo</label>
                            <input style={inp} type="email" name="correo" value={form.correo}
                                onChange={handleInputChange} placeholder="correo@ejemplo.com" />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={lbl}>Dirección</label>
                            <input style={inp} type="text" name="direccion" value={form.direccion}
                                onChange={handleInputChange} placeholder="Av. El Sol 123" />
                        </div>
                        <div>
                            <label style={lbl}>Licencia</label>
                            <input style={inp} type="text" name="licencia_conducir" value={form.licencia_conducir}
                                onChange={handleInputChange} placeholder="Q12345678" />
                        </div>
                        <div>
                            <label style={lbl}>Vencimiento</label>
                            <input style={inp} type="date" name="fecha_vencimiento_licencia"
                                value={form.fecha_vencimiento_licencia} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button type="submit"
                            style={{ flex: 1, padding: '0.65rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                            {modoEdicion ? 'Actualizar' : 'Registrar'}
                        </button>
                        {modoEdicion && (
                            <button type="button" onClick={resetForm}
                                style={{ flex: 1, padding: '0.65rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── Tabla ── */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <h3 style={{ color: '#1a1a2e', marginTop: 0 }}>
                     Clientes registrados ({clientes.length})
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['DNI', 'Nombre completo', 'Teléfono', 'Correo', 'Licencia', 'Acciones'].map(h => (
                                    <th key={h} style={{
                                        padding: '0.6rem 0.75rem', textAlign: 'left',
                                        fontSize: 11, fontWeight: 600, color: '#6b7280',
                                        textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        No hay clientes registrados.
                                    </td>
                                </tr>
                            ) : (
                                clientes.map((c, i) => (
                                    <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>{c.persona?.dni}</td>
                                        <td style={{ padding: '0.6rem 0.75rem' }}>{c.persona?.nombres} {c.persona?.apellidos}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', color: '#6b7280' }}>{c.persona?.telefono || '—'}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', color: '#6b7280' }}>{c.persona?.correo || '—'}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace' }}>{c.licencia_conducir || '—'}</td>
                                        <td style={{ padding: '0.6rem 0.75rem', display: 'flex', gap: 4 }}>
                                            <button onClick={() => editarCliente(c)}
                                                style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 8px', fontSize: 12, cursor: 'pointer' }}>
                                                    Editar
                                            </button>
                                            <button onClick={() => desactivarCliente(c.id)}
                                                style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 6, padding: '3px 8px', fontSize: 12, cursor: 'pointer' }}>
                                                    Desactivar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}