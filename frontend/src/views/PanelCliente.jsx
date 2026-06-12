import { useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import clienteAxios from '../config/axios';

const API_STORAGE = 'http://127.0.0.1:8000/storage';

const MENU_CLIENTE = [
    { id: 'dashboard-cliente', label: 'Inicio' },
    { id: 'buscar-vehiculos', label: 'Buscar Vehículos' },
    { id: 'mis-reservas', label: 'Mis Reservas' },
    { id: 'mis-alquileres', label: 'Mis Alquileres' },
    { id: 'mis-pagos', label: 'Mis Pagos' },
    { id: 'mi-perfil', label: 'Mi Perfil' },
];

function DashboardCliente({ totalDisponibles }) {
    const cards = [
        ['Vehículos disponibles', totalDisponibles],
        ['Reservas activas', '—'],
        ['Alquileres en curso', '—'],
        ['Pagos pendientes', '—'],
    ];

    return (
        <div>
            <h2>Dashboard Cliente</h2>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
                {cards.map(([title, value]) => (
                    <div key={title} style={{ background:'#fff', borderRadius:14, padding:'1.4rem', boxShadow:'0 3px 14px rgba(0,0,0,.08)' }}>
                        <p style={{ color:'#777', margin:0 }}>{title}</p>
                        <h2 style={{ margin:'0.5rem 0 0', color:'#ff4d00' }}>{value}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BuscarVehiculos({ vehiculos }) {
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [orden, setOrden] = useState('');

    const categorias = useMemo(() => {
        const mapa = new Map();

        vehiculos.forEach(v => {
            if (v.categoria) {
                mapa.set(v.categoria.id, v.categoria.nombre);
            }
        });

        return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
    }, [vehiculos]);

    const vehiculosFiltrados = useMemo(() => {
        let lista = vehiculos.filter(v => v.estado === 'disponible');

        if (busqueda.trim()) {
            const q = busqueda.toLowerCase();

            lista = lista.filter(v =>
                `${v.marca} ${v.modelo} ${v.placa}`.toLowerCase().includes(q)
            );
        }

        if (categoria) {
            lista = lista.filter(v => String(v.id_categoria) === String(categoria));
        }

        if (orden === 'menor') {
            lista = [...lista].sort((a, b) => Number(a.precio_diario) - Number(b.precio_diario));
        }

        if (orden === 'mayor') {
            lista = [...lista].sort((a, b) => Number(b.precio_diario) - Number(a.precio_diario));
        }

        return lista;
    }, [vehiculos, busqueda, categoria, orden]);

    return (
        <div>
            <h2>Buscar Vehículos</h2>

            <div style={{
                background:'#fff',
                padding:'1rem',
                borderRadius:16,
                boxShadow:'0 3px 14px rgba(0,0,0,.08)',
                marginBottom:'1.5rem',
                display:'flex',
                gap:'1rem',
                flexWrap:'wrap'
            }}>
                <input
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar marca, modelo o placa"
                    style={{ padding:'0.75rem', borderRadius:10, border:'1px solid #ddd', flex:'1 1 220px' }}
                />

                <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    style={{ padding:'0.75rem', borderRadius:10, border:'1px solid #ddd' }}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <select
                    value={orden}
                    onChange={e => setOrden(e.target.value)}
                    style={{ padding:'0.75rem', borderRadius:10, border:'1px solid #ddd' }}
                >
                    <option value="">Ordenar precio</option>
                    <option value="menor">Menor precio</option>
                    <option value="mayor">Mayor precio</option>
                </select>
            </div>

            {vehiculosFiltrados.length === 0 ? (
                <div style={{ background:'#fff', padding:'2rem', borderRadius:16, textAlign:'center', color:'#777' }}>
                    No hay vehículos disponibles para esta búsqueda.
                </div>
            ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1rem' }}>
                    {vehiculosFiltrados.map(v => (
                        <div
                            key={v.id}
                            style={{
                                background:'#fff',
                                borderRadius:18,
                                overflow:'hidden',
                                boxShadow:'0 3px 14px rgba(0,0,0,.08)',
                                border:'1px solid #f1f1f1'
                            }}
                        >
                            <div style={{
                                height:170,
                                background:'#fff',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                borderBottom:'1px solid #f3f4f6'
                            }}>
                                {v.imagen ? (
                                    <img
                                        src={`${API_STORAGE}/${v.imagen}`}
                                        alt={`${v.marca} ${v.modelo}`}
                                        style={{
                                            width:'100%',
                                            height:'100%',
                                            objectFit:'contain',
                                            padding:'0.75rem',
                                            boxSizing:'border-box'
                                        }}
                                    />
                                ) : (
                                    <div style={{ color:'#bbb', fontSize:13 }}>Sin imagen</div>
                                )}
                            </div>

                            <div style={{ padding:'1rem' }}>
                                <span style={{
                                    display:'inline-block',
                                    background:'#fff1e8',
                                    color:'#ff4d00',
                                    padding:'0.25rem 0.6rem',
                                    borderRadius:20,
                                    fontSize:12,
                                    fontWeight:700,
                                    marginBottom:8
                                }}>
                                    {v.categoria?.nombre || 'Sin categoría'}
                                </span>

                                <h3 style={{ margin:'0 0 4px', color:'#111827' }}>
                                    {v.marca} {v.modelo}
                                </h3>

                                <p style={{ color:'#777', margin:'0 0 8px', fontSize:13 }}>
                                    Año {v.anio} · {v.transmision || 'Transmisión no especificada'}
                                </p>

                                <p style={{ color:'#16a34a', fontWeight:700, margin:'0 0 8px', fontSize:13 }}>
                                    Disponible
                                </p>

                                <strong style={{ color:'#ff4d00', fontSize:20 }}>
                                    S/ {Number(v.precio_diario).toFixed(2)}
                                    <span style={{ fontSize:12, color:'#777', fontWeight:400 }}> / día</span>
                                </strong>

                                <button
                                    style={{
                                        marginTop:'1rem',
                                        width:'100%',
                                        padding:'0.75rem',
                                        background:'#ff4d00',
                                        color:'#fff',
                                        border:'none',
                                        borderRadius:10,
                                        cursor:'pointer',
                                        fontWeight:700
                                    }}
                                >
                                    Reservar ahora
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Placeholder({ titulo }) {
    return (
        <div style={{ background:'#fff', borderRadius:16, padding:'2rem', boxShadow:'0 3px 14px rgba(0,0,0,.08)' }}>
            <h2>{titulo}</h2>
            <p style={{ color:'#777' }}>Este módulo estará conectado a la API correspondiente.</p>
        </div>
    );
}

export default function PanelCliente() {
    const { auth, logout } = useAuth();

    const [seccion, setSeccion] = useState('dashboard-cliente');
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const cargarVehiculos = async () => {
            setCargando(true);

            try {
                const { data } = await clienteAxios.get('/vehiculos');
                setVehiculos(data);
            } catch (error) {
                console.error('Error al cargar vehículos para cliente', error);
            } finally {
                setCargando(false);
            }
        };

        cargarVehiculos();
    }, []);

    const totalDisponibles = vehiculos.filter(v => v.estado === 'disponible').length;

    const render = () => {
        if (cargando) {
            return (
                <div style={{ background:'#fff', padding:'2rem', borderRadius:16 }}>
                    Cargando vehículos...
                </div>
            );
        }

        switch (seccion) {
            case 'dashboard-cliente':
                return <DashboardCliente totalDisponibles={totalDisponibles} />;
            case 'buscar-vehiculos':
                return <BuscarVehiculos vehiculos={vehiculos} />;
            case 'mis-reservas':
                return <Placeholder titulo="Mis Reservas" />;
            case 'mis-alquileres':
                return <Placeholder titulo="Mis Alquileres" />;
            case 'mis-pagos':
                return <Placeholder titulo="Mis Pagos" />;
            case 'mi-perfil':
                return <Placeholder titulo="Mi Perfil" />;
            default:
                return <DashboardCliente totalDisponibles={totalDisponibles} />;
        }
    };

    return (
        <div style={{ minHeight:'100vh', background:'#f5f4f0' }}>
            <header style={{
                background:'#fff',
                padding:'1rem 2rem',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                boxShadow:'0 2px 10px rgba(0,0,0,.08)'
            }}>
                <h2 style={{ color:'#ff4d00', margin:0 }}>Gestión de Alquiler</h2>

                <div>
                    <span style={{ marginRight:16 }}>Hola, {auth?.nombre}</span>
                    <button
                        onClick={logout}
                        style={{
                            background:'#1a1a2e',
                            color:'#fff',
                            border:'none',
                            padding:'0.6rem 1rem',
                            borderRadius:10,
                            cursor:'pointer'
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <div style={{ display:'flex' }}>
                <aside style={{
                    width:240,
                    background:'#fff',
                    minHeight:'calc(100vh - 70px)',
                    padding:'1rem',
                    boxShadow:'2px 0 10px rgba(0,0,0,.05)'
                }}>
                    {MENU_CLIENTE.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setSeccion(m.id)}
                            style={{
                                width:'100%',
                                display:'flex',
                                gap:10,
                                alignItems:'center',
                                padding:'0.8rem',
                                marginBottom:8,
                                border:'none',
                                borderRadius:10,
                                cursor:'pointer',
                                background: seccion === m.id ? '#fff1e8' : 'transparent',
                                color: seccion === m.id ? '#ff4d00' : '#374151',
                                fontWeight: seccion === m.id ? 700 : 500,
                                textAlign:'left'
                            }}
                        >
                            <span>{m.label}</span>
                        </button>
                    ))}
                </aside>

                <main style={{ flex:1, padding:'2rem' }}>
                    {render()}
                </main>
            </div>
        </div>
    );
}