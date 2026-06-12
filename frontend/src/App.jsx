import { useEffect, useMemo, useState } from 'react';

import { AuthProvider } from './context/AuthContext';
import { VehiculoProvider } from './context/VehiculoContext';
import { ClienteProvider } from './context/ClienteContext';

import useAuth from './hooks/useAuth';
import clienteAxios from './config/axios';
import Login from './views/Login';
import Vehiculo from './views/Vehiculo';
import ListaVehiculos from './views/ListaVehiculos';
import { ClientesView } from './views/Cliente';
import PanelCliente from './views/PanelCliente';

const MENU = [
    { id:'dashboard', label:'Dashboard' },
    { id:'vehiculos', label:'Vehículos' },
    { id:'clientes', label:'Clientes' },
    { id:'reservas', label:'Reservas' },
    { id:'alquileres', label:'Alquileres' },
    { id:'pagos', label:'Pagos' },
    { id:'caja', label:'Caja' },
    { id:'mantenimiento', label:'Mantenimiento' },
];

const card = {
    background:'#fff',
    borderRadius:14,
    padding:'1.2rem',
    boxShadow:'0 2px 10px rgba(0,0,0,0.07)',
};

const input = {
    padding:'0.65rem 0.8rem',
    border:'1px solid #d1d5db',
    borderRadius:8,
    fontSize:14,
};

const btnPrimary = {
    padding:'0.65rem 1rem',
    background:'#1a1a2e',
    color:'#fff',
    border:'none',
    borderRadius:8,
    cursor:'pointer',
    fontWeight:700,
};

const btnSoft = {
    padding:'0.55rem 0.8rem',
    background:'#eff6ff',
    color:'#2563eb',
    border:'1px solid #bfdbfe',
    borderRadius:8,
    cursor:'pointer',
    fontWeight:600,
};

const btnDanger = {
    padding:'0.55rem 0.8rem',
    background:'#fef2f2',
    color:'#dc2626',
    border:'1px solid #fecaca',
    borderRadius:8,
    cursor:'pointer',
    fontWeight:600,
};

function formatDate(value) {
    if (!value) return '—';
    return String(value).slice(0, 10);
}

function money(value) {
    return `S/ ${Number(value || 0).toFixed(2)}`;
}

function Dashboard({ datos, onGo }) {
    const vehiculos = datos.vehiculos || [];
    const clientes = datos.clientes || [];
    const alquileres = datos.alquileres || [];
    const pagos = datos.pagos || [];

    const ingresos = pagos
        .filter(p => ['aprobado','pagado'].includes(p.estado))
        .reduce((sum, p) => sum + Number(p.monto || 0), 0);

    const cards = [
        { label:'Vehículos', val: vehiculos.length, color:'#3b82f6' },
        { label:'Clientes', val: clientes.length, color:'#10b981' },
        { label:'Reservas', val: (datos.reservas || []).length, color:'#f97316' },
        { label:'Alquileres', val: alquileres.length, color:'#f59e0b' },
        { label:'Ingresos', val: money(ingresos), color:'#8b5cf6' },
        { label:'Mantenimientos', val: (datos.mantenimientos || []).length, color:'#9333ea' },
    ];

    return (
        <div>
            <h2 style={{ color:'#1a1a2e', marginTop:0 }}>Dashboard Administrativo</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
                {cards.map(c => (
                    <div key={c.label} style={{ ...card, borderLeft:`4px solid ${c.color}` }}>
                        <p style={{ margin:'0.5rem 0 0', color:'#9ca3af', fontSize:13 }}>{c.label}</p>
                        <p style={{ margin:0, fontSize:26, fontWeight:700, color:'#1a1a2e' }}>{c.val}</p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop:'2rem', ...card }}>
                <h3 style={{ margin:'0 0 1rem', color:'#374151' }}>Accesos rápidos</h3>
                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
                    {[
                        ['vehiculos','Nuevo vehículo'],
                        ['clientes','Nuevo cliente'],
                        ['reservas','Ver reservas'],
                        ['alquileres','Ver alquileres'],
                        ['pagos','Registrar pago'],
                        ['caja','Caja'],
                        ['mantenimiento','Mantenimiento'],
                    ].map(([id, label]) => (
                        <button key={id} onClick={() => onGo(id)} style={btnSoft}>{label}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReservasAdmin({ reservas, cargarDatos }) {
    const cambiarEstado = async (id, estado) => {
        try {
            await clienteAxios.put(`/reservas/${id}`, { estado });
            await cargarDatos();
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo actualizar la reserva.');
        }
    };

    const crearAlquiler = async (reserva) => {
        const fecha_salida = prompt('Fecha de salida (YYYY-MM-DD):', formatDate(reserva.fecha_inicio));
        if (!fecha_salida) return;

        const fecha_devolucion_programada = prompt('Fecha devolución programada (YYYY-MM-DD):', formatDate(reserva.fecha_fin));
        if (!fecha_devolucion_programada) return;

        try {
            await clienteAxios.post('/alquileres', {
                id_reserva: reserva.id,
                fecha_salida,
                fecha_devolucion_programada,
            });
            alert('Alquiler creado correctamente.');
            await cargarDatos();
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo crear el alquiler.');
        }
    };

    return (
        <div>
            <h2>Gestión de Reservas</h2>
            <div style={{ display:'grid', gap:'1rem' }}>
                {reservas.length === 0 && <div style={card}>No hay reservas registradas.</div>}
                {reservas.map(r => (
                    <div key={r.id} style={card}>
                        <h3 style={{ marginTop:0 }}>{r.vehiculo?.marca} {r.vehiculo?.modelo}</h3>
                        <p><b>Cliente:</b> {r.cliente?.persona?.nombres} {r.cliente?.persona?.apellidos}</p>
                        <p><b>Fechas:</b> {formatDate(r.fecha_inicio)} a {formatDate(r.fecha_fin)}</p>
                        <p><b>Total:</b> {money(r.total_estimado)} | <b>Estado:</b> {r.estado}</p>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                            {r.estado === 'pendiente' && <button style={btnSoft} onClick={() => cambiarEstado(r.id, 'confirmada')}>Confirmar</button>}
                            {['pendiente','confirmada'].includes(r.estado) && <button style={btnDanger} onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>}
                            {['pendiente','confirmada'].includes(r.estado) && <button style={btnPrimary} onClick={() => crearAlquiler(r)}>Convertir a alquiler</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AlquileresAdmin({ alquileres, cargarDatos }) {
    const finalizar = async (alquiler) => {
        const fecha_devolucion_real = prompt('Fecha de devolución real (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
        if (!fecha_devolucion_real) return;

        const penalidad = prompt('Penalidad (0 si no aplica):', '0');
        if (penalidad === null) return;

        try {
            await clienteAxios.put(`/alquileres/${alquiler.id}/finalizar`, {
                fecha_devolucion_real,
                penalidad: Number(penalidad || 0),
            });
            alert('Alquiler finalizado.');
            await cargarDatos();
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo finalizar el alquiler.');
        }
    };

    return (
        <div>
            <h2>Gestión de Alquileres</h2>
            <div style={{ display:'grid', gap:'1rem' }}>
                {alquileres.length === 0 && <div style={card}>No hay alquileres registrados.</div>}
                {alquileres.map(a => (
                    <div key={a.id} style={card}>
                        <h3 style={{ marginTop:0 }}>{a.vehiculo?.marca} {a.vehiculo?.modelo}</h3>
                        <p><b>Cliente:</b> {a.cliente?.persona?.nombres} {a.cliente?.persona?.apellidos}</p>
                        <p><b>Salida:</b> {formatDate(a.fecha_salida)} | <b>Dev. programada:</b> {formatDate(a.fecha_devolucion_programada)}</p>
                        <p><b>Monto:</b> {money(a.monto_total)} | <b>Estado:</b> {a.estado}</p>
                        {a.estado === 'activo' && <button style={btnPrimary} onClick={() => finalizar(a)}>Finalizar alquiler</button>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PagosAdmin({ pagos, cargarDatos }) {
    const aprobar = async (id) => {
        if (!confirm('¿Aprobar este pago?')) return;

        try {
            await clienteAxios.put(`/pagos/${id}/aprobar`);
            await cargarDatos();
            alert('Pago aprobado correctamente. El ingreso fue enviado a caja si existe una caja abierta.');
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo aprobar el pago.');
        }
    };

    const rechazar = async (id) => {
        const observacion = prompt('Motivo del rechazo:', 'Pago no válido');
        if (observacion === null) return;

        try {
            await clienteAxios.put(`/pagos/${id}/rechazar`, { observacion });
            await cargarDatos();
            alert('Pago rechazado correctamente.');
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo rechazar el pago.');
        }
    };

    const anular = async (id) => {
        if (!confirm('¿Anular este pago?')) return;

        try {
            await clienteAxios.put(`/pagos/${id}/anular`);
            await cargarDatos();
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo anular el pago.');
        }
    };

    const estadoColor = {
        pendiente: '#f59e0b',
        aprobado: '#16a34a',
        rechazado: '#dc2626',
        anulado: '#6b7280',
        pagado: '#16a34a',
    };

    return (
        <div>
            <h2>Pagos</h2>
            <div style={{ ...card, marginBottom: '1rem', background: '#f8fafc' }}>
                <b>Validación de pagos</b>
                
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {pagos.length === 0 && <div style={card}>No hay pagos registrados.</div>}

                {pagos.map(p => (
                    <div key={p.id} style={card}>
                        <p>
                            <b>Cliente:</b> {p.alquiler?.cliente?.persona?.nombres} {p.alquiler?.cliente?.persona?.apellidos}
                        </p>
                        <p>
                            <b>Vehículo:</b> {p.alquiler?.vehiculo?.marca} {p.alquiler?.vehiculo?.modelo}
                        </p>
                        <p>
                            <b>Alquiler:</b> #{p.id_alquiler} | <b>Monto:</b> {money(p.monto)} | <b>Método:</b> {p.metodo_pago}
                        </p>
                        <p>
                            <b>Fecha:</b> {formatDate(p.fecha_pago)} | <b>Estado:</b>{' '}
                            <span style={{ color: estadoColor[p.estado] || '#111827', fontWeight: 800 }}>
                                {p.estado}
                            </span>
                        </p>

                        {p.nro_operacion && <p><b>Nro. operación:</b> {p.nro_operacion}</p>}
                        {p.observacion && <p><b>Observación:</b> {p.observacion}</p>}

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {p.estado === 'pendiente' && (
                                <>
                                    <button style={btnSoft} onClick={() => aprobar(p.id)}>Confirmar pago</button>
                                    <button style={btnDanger} onClick={() => rechazar(p.id)}>Rechazar</button>
                                </>
                            )}

                            {!['anulado', 'rechazado'].includes(p.estado) && (
                                <button style={btnDanger} onClick={() => anular(p.id)}>Anular</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CajaAdmin({ caja, cargarDatos }) {
    const abrir = async () => {
        const monto_inicial = prompt('Monto inicial de caja:', '0');
        if (monto_inicial === null) return;

        try {
            await clienteAxios.post('/caja/abrir', { monto_inicial: Number(monto_inicial || 0) });
            await cargarDatos();
        } catch (error) {
            alert(error.response?.data?.mensaje || error.response?.data?.message || 'No se pudo abrir caja.');
        }
    };

    const cerrar = async () => {
        if (!caja) return;
        if (!confirm('¿Cerrar caja actual?')) return;

        await clienteAxios.put(`/caja/${caja.id}/cerrar`);
        await cargarDatos();
    };

    return (
        <div>
            <h2>Caja</h2>
            <div style={card}>
                {!caja ? (
                    <>
                        <p>No hay caja abierta actualmente.</p>
                        <button style={btnPrimary} onClick={abrir}>Abrir caja</button>
                    </>
                ) : (
                    <>
                        <p><b>Estado:</b> {caja.estado}</p>
                        <p><b>Monto inicial:</b> {money(caja.monto_inicial)}</p>
                        <p><b>Ingresos:</b> {money(caja.total_ingresos)}</p>
                        <p><b>Egresos:</b> {money(caja.total_egresos)}</p>
                        <p><b>Monto final:</b> {money(caja.monto_final)}</p>
                        <button style={btnDanger} onClick={cerrar}>Cerrar caja</button>

                        <h3>Movimientos</h3>
                        {(caja.movimientos || []).map(m => (
                            <div key={m.id} style={{ borderTop:'1px solid #eee', padding:'0.7rem 0' }}>
                                <b>{m.tipo}</b> - {m.concepto} - {money(m.monto)}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

function MantenimientoAdmin({ vehiculos, mantenimientos, cargarDatos }) {
    const [form, setForm] = useState({ id_vehiculo:'', tipo:'preventivo', descripcion:'', fecha_inicio:'', fecha_fin:'', costo:'0' });

    const registrar = async (e) => {
        e.preventDefault();
        try {
            await clienteAxios.post('/mantenimientos', form);
            setForm({ id_vehiculo:'', tipo:'preventivo', descripcion:'', fecha_inicio:'', fecha_fin:'', costo:'0' });
            await cargarDatos();
            alert('Mantenimiento registrado.');
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo registrar mantenimiento.');
        }
    };

    const cambiarEstado = async (m, estado) => {
        await clienteAxios.put(`/mantenimientos/${m.id}`, {
            estado,
            fecha_fin: estado === 'finalizado' ? new Date().toISOString().slice(0,10) : m.fecha_fin,
            costo: m.costo || 0,
        });
        await cargarDatos();
    };

    return (
        <div>
            <h2>Mantenimiento</h2>

            <form onSubmit={registrar} style={{ ...card, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'1rem' }}>
                <select required value={form.id_vehiculo} onChange={e => setForm({ ...form, id_vehiculo:e.target.value })} style={input}>
                    <option value="">Seleccione vehículo</option>
                    {vehiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.marca} {v.modelo}</option>)}
                </select>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo:e.target.value })} style={input}>
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                </select>
                <input required type="date" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio:e.target.value })} style={input} />
                <input type="number" min="0" step="0.01" value={form.costo} onChange={e => setForm({ ...form, costo:e.target.value })} style={input} />
                <input placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion:e.target.value })} style={input} />
                <button style={btnPrimary}>Registrar mantenimiento</button>
            </form>

            <div style={{ display:'grid', gap:'1rem' }}>
                {mantenimientos.length === 0 && <div style={card}>No hay mantenimientos registrados.</div>}
                {mantenimientos.map(m => (
                    <div key={m.id} style={card}>
                        <p><b>Vehículo:</b> {m.vehiculo?.marca} {m.vehiculo?.modelo}</p>
                        <p><b>Tipo:</b> {m.tipo} | <b>Estado:</b> {m.estado} | <b>Costo:</b> {money(m.costo)}</p>
                        <p>{m.descripcion}</p>
                        {m.estado !== 'finalizado' && (
                            <div style={{ display:'flex', gap:8 }}>
                                <button style={btnSoft} onClick={() => cambiarEstado(m, 'en_proceso')}>En proceso</button>
                                <button style={btnPrimary} onClick={() => cambiarEstado(m, 'finalizado')}>Finalizar</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Layout() {
    const { auth, logout, esAdmin } = useAuth();
    const [seccion, setSeccion] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const [datos, setDatos] = useState({ vehiculos:[], clientes:[], reservas:[], alquileres:[], pagos:[], caja:null, mantenimientos:[] });
    const [cargando, setCargando] = useState(false);

    const cargarDatos = async () => {
        if (!auth || !esAdmin()) return;

        setCargando(true);
        try {
            const [vehiculos, clientes, reservas, alquileres, pagos, caja, mantenimientos] = await Promise.all([
                clienteAxios.get('/vehiculos'),
                clienteAxios.get('/clientes'),
                clienteAxios.get('/reservas'),
                clienteAxios.get('/alquileres'),
                clienteAxios.get('/pagos'),
                clienteAxios.get('/caja/estado'),
                clienteAxios.get('/mantenimientos'),
            ]);

            setDatos({
                vehiculos: vehiculos.data,
                clientes: clientes.data,
                reservas: reservas.data,
                alquileres: alquileres.data,
                pagos: pagos.data,
                caja: caja.data,
                mantenimientos: mantenimientos.data,
            });
        } catch (error) {
            console.error('Error al cargar datos administrativos:', error.response?.data || error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [auth]);

    if (!auth) return <Login />;

    if (!esAdmin()) {
        return <PanelCliente />;
    }

    const renderSeccion = () => {
        if (cargando && seccion === 'dashboard') {
            return <div style={card}>Cargando información...</div>;
        }

        switch (seccion) {
            case 'dashboard':
                return <Dashboard datos={datos} onGo={setSeccion} />;
            case 'vehiculos':
                return (
                    <VehiculoProvider>
                        <h2 style={{ color:'#1a1a2e', marginTop:0 }}>Gestión de Vehículos</h2>
                        <div style={{ display:'grid', gridTemplateColumns:'minmax(320px,380px) minmax(0,1fr)', gap:'1.5rem' }}>
                            <Vehiculo />
                            <ListaVehiculos />
                        </div>
                    </VehiculoProvider>
                );
            case 'clientes':
                return (
                    <ClienteProvider>
                        <h2 style={{ color:'#1a1a2e', marginTop:0 }}>Gestión de Clientes</h2>
                        <ClientesView />
                    </ClienteProvider>
                );
            case 'reservas':
                return <ReservasAdmin reservas={datos.reservas} cargarDatos={cargarDatos} />;
            case 'alquileres':
                return <AlquileresAdmin alquileres={datos.alquileres} cargarDatos={cargarDatos} />;
            case 'pagos':
                return <PagosAdmin alquileres={datos.alquileres} pagos={datos.pagos} cargarDatos={cargarDatos} />;
            case 'caja':
                return <CajaAdmin caja={datos.caja} cargarDatos={cargarDatos} />;
            case 'mantenimiento':
                return <MantenimientoAdmin vehiculos={datos.vehiculos} mantenimientos={datos.mantenimientos} cargarDatos={cargarDatos} />;
            default:
                return <Dashboard datos={datos} onGo={setSeccion} />;
        }
    };

    return (
        <div style={{ display:'flex', width:'100%', minHeight:'100vh', background:'#f5f4f0', overflowX:'hidden' }}>
            <aside style={{ width: collapsed ? 64 : 220, background:'#1a1a2e', transition:'width 0.2s', display:'flex', flexDirection:'column', flexShrink:0 }}>
                <div style={{ padding:'1.25rem 1rem', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    {!collapsed && <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Gestión de Alquiler</span>}
                    <button onClick={() => setCollapsed(!collapsed)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:18, padding:0 }}>
                        {collapsed ? '→' : '←'}
                    </button>
                </div>
                <nav style={{ flex:1, padding:'0.75rem 0' }}>
                    {MENU.map(m => (
                        <button key={m.id} onClick={() => setSeccion(m.id)}
                            style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', padding:'0.65rem 1rem', background: seccion===m.id ? 'rgba(255,255,255,0.1)' : 'none',
                                border:'none', color: seccion===m.id ? '#fff' : 'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:14, textAlign:'left', borderLeft: seccion===m.id ? '3px solid #3b82f6' : '3px solid transparent' }}>
                            {!collapsed && <span>{m.label}</span>}
                        </button>
                    ))}
                </nav>
                <div style={{ padding:'1rem', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                    {!collapsed && <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, margin:'0 0 8px' }}>{auth.nombre}</p>}
                    <button onClick={logout} style={{ width:'100%', padding:'0.5rem', background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, cursor:'pointer', fontSize:13 }}>
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main style={{ flex:1, minWidth:0, width:'100%', minHeight:'100vh', padding:'1rem', overflowY:'auto', overflowX:'hidden', boxSizing:'border-box' }}>
                {renderSeccion()}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Layout />
        </AuthProvider>
    );
}
