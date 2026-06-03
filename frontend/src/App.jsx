import { useState } from 'react';

import { AuthProvider } from './context/AuthContext';
import { VehiculoProvider } from './context/VehiculoContext';
import { ClienteProvider } from './context/ClienteContext';

import useAuth from './hooks/useAuth';
import Login from './views/Login';
import Vehiculo from './views/Vehiculo';
import ListaVehiculos from './views/ListaVehiculos';
import { ClientesView } from './views/Cliente';
 
const MENU = [
    { id:'dashboard',       label:'Dashboard'   },
    { id:'vehiculos',       label:'Vehículos'   },
    { id:'clientes',        label:'Clientes'    },
    { id:'reservas',        label:'Reservas'    },
    { id:'alquileres',      label:'Alquileres'  },
    { id:'pagos',           label:'Pagos'       },
    { id:'caja',            label:'Caja'        },
    { id:'mantenimiento',   label:'Mantenimiento'},
];
 
function Dashboard({ stats }) {
    const cards = [
        { label:'Vehículos',    val: stats.vehiculos,  color:'#3b82f6' },
        { label:'Clientes',     val: stats.clientes,   color:'#10b981' },
        { label:'Alquileres',   val: stats.alquileres, color:'#f59e0b' },
        { label:'Ingresos hoy', val: `S/ ${stats.ingresos}`, color:'#8b5cf6' },
    ];
    return (
        <div>
            <h2 style={{ color:'#1a1a2e', marginTop:0 }}>Dashboard</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }}>
                {cards.map(c => (
                    <div key={c.label} style={{ background:'#fff', borderRadius:14, padding:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.07)', borderLeft:`4px solid ${c.color}` }}>
                        <div style={{ fontSize:32 }}>{c.icon}</div>
                        <p style={{ margin:'0.5rem 0 0', color:'#9ca3af', fontSize:13 }}>{c.label}</p>
                        <p style={{ margin:0, fontSize:26, fontWeight:700, color:'#1a1a2e' }}>{c.val ?? '—'}</p>
                    </div>
                ))}
            </div>
            <div style={{ marginTop:'2rem', background:'#fff', borderRadius:14, padding:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' }}>
                <h3 style={{ margin:'0 0 1rem', color:'#374151' }}>Accesos rápidos</h3>
                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', }}>
                    {['Nuevo vehículo','Nuevo cliente','Nueva reserva','Nuevo alquiler'].map(a => (
                        <button key={a} style={{ padding:'0.6rem 1.2rem', background:'#f3f4f6', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, cursor:'pointer', fontWeight:500 }}>{a}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}
 
function ProximaVista({ nombre }) {
    return (
        <div style={{ textAlign:'center', padding:'4rem 2rem', color:'#9ca3af' }}>
            <h3 style={{ color:'#374151' }}>Módulo: {nombre}</h3>
            <p>Este módulo está en desarrollo. El backend está listo en /api/{nombre.toLowerCase()}.</p>
        </div>
    );
}
 
function Layout() {
    const { auth, logout }   = useAuth();
    const [seccion, setSeccion] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
 
    if (!auth) return <Login />;
 
    const renderSeccion = () => {
        switch (seccion) {
            case 'dashboard':
                return <Dashboard stats={{ vehiculos:null, clientes:null, alquileres:null, ingresos:'0.00' }} />;
            case 'vehiculos':
                return (
                    <VehiculoProvider>
                        <h2 style={{ color:'#1a1a2e', marginTop:0 }}>Gestión de Vehículos</h2>
                        <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:'1.5rem' }}>
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
            default:
                return <ProximaVista nombre={MENU.find(m => m.id === seccion)?.label || seccion} />;
        }
    };
 
    return (
        <div style={{ display:'flex', minHeight:'100vh', background:'#f5f4f0' }}>
            {/* Sidebar */}
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
                            <span style={{ fontSize:18, flexShrink:0 }}>{m.icon}</span>
                            {!collapsed && <span>{m.label}</span>}
                        </button>
                    ))}
                </nav>
                <div style={{ padding:'1rem', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                    {!collapsed && <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, margin:'0 0 8px' }}>{auth.nombre}</p>}
                    <button onClick={logout} style={{ width:'100%', padding:'0.5rem', background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, cursor:'pointer', fontSize:13 }}>
                        {'Cerrar sesión'}
                    </button>
                </div>
            </aside>
 
            {/* Contenido */}
            <main style={{ flex:1, padding:'2rem', overflowY:'auto' }}>
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