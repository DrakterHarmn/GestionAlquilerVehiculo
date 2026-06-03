import { useContext } from 'react';
import VehiculoContext from '../context/VehiculoContext';

const COLORES_ESTADO = {
    disponible:    { bg:'#dcfce7', text:'#166534' },
    reservado:     { bg:'#fef9c3', text:'#854d0e' },
    alquilado:     { bg:'#dbeafe', text:'#1e40af' },
    mantenimiento: { bg:'#f3e8ff', text:'#6b21a8' },
    inactivo:      { bg:'#f1f5f9', text:'#475569' },
};
 
function ListaVehiculos() {
    const { vehiculos = [], cargando, editarVehiculo, eliminarVehiculo } = useContext(VehiculoContext);

    if (cargando) return (
        <div style={{ textAlign:'center', padding:'3rem', color:'#9ca3af' }}>
             Cargando vehículos...
        </div>
    );

    if (!vehiculos.length) return (
        <div style={{ textAlign:'center', padding:'3rem', color:'#9ca3af' }}>
            <div style={{ fontSize:56 }}></div>
            <p style={{ fontSize:16 }}>No hay vehículos registrados.</p>
        </div>
    );

    return (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
            {vehiculos.map(v => {
                const color = COLORES_ESTADO[v.estado] || COLORES_ESTADO.inactivo;
                return (
                    <div key={v.id} style={{ background:'#fff', borderRadius:14, boxShadow:'0 2px 10px rgba(0,0,0,0.07)', overflow:'hidden' }}>

                        {/* Header */}
                        <div style={{ background:'#1a1a2e', padding:'0.9rem 1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span style={{ color:'#fff', fontWeight:700, fontSize:14, fontFamily:'monospace' }}>{v.placa}</span>
                            <span style={{ background:color.bg, color:color.text, fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:20 }}>
                                {v.estado}
                            </span>
                        </div>

                        {/* Body */}
                        <div style={{ padding:'0.9rem 1rem' }}>
                            <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:15 }}>{v.marca} {v.modelo}</p>
                            <p style={{ margin:'0 0 4px', color:'#9ca3af', fontSize:13 }}>
                                Año {v.anio} · {v.color || '—'} · {v.transmision || '—'}
                            </p>
                            <p style={{ margin:'0 0 6px', fontSize:13 }}>
                                 {v.categoria?.nombre || '—'}
                            </p>
                            <p style={{ margin:0, color:'#16a34a', fontWeight:700, fontSize:16 }}>
                                S/ {parseFloat(v.precio_diario).toFixed(2)}
                                <span style={{ color:'#9ca3af', fontWeight:400, fontSize:12 }}> /día</span>
                            </p>
                        </div>

                        {/* Footer */}
                        <div style={{ padding:'0 1rem 0.9rem', display:'flex', gap:'0.5rem' }}>
                            <button onClick={() => editarVehiculo(v)}
                                style={{ flex:1, padding:'0.45rem', background:'#eff6ff', color:'#3b82f6', border:'1px solid #bfdbfe', borderRadius:8, fontSize:13, cursor:'pointer' }}>
                                 Editar
                            </button>
                            <button onClick={() => eliminarVehiculo(v.id)}
                                style={{ flex:1, padding:'0.45rem', background:'#fef2f2', color:'#ef4444', border:'1px solid #fecaca', borderRadius:8, fontSize:13, cursor:'pointer' }}>
                                 Eliminar
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ListaVehiculos;