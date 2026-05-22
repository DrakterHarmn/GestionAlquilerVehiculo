import useVehiculo from "../hooks/useVehiculo";

const ICONOS = {
    carro:     '🚗',
    moto:      '🏍️',
    mototaxi:  '🛺',
    bicicleta: '🚲',
    scooter:   '🛵',
};

export default function ListaVehiculos() {

    const { vehiculos, cargando, editarVehiculo, eliminarVehiculo } = useVehiculo();

    if (cargando) {
        return (
            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                Cargando vehículos...
            </p>
        );
    }

    if (vehiculos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                <p style={{ fontSize: '48px' }}>📦</p>
                <p>No hay vehículos registrados.</p>
            </div>
        );
    }

    return (

        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
            marginTop: '16px',
        }}>

            {vehiculos.map((v) => (

                <div
                    key={v.id}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                >

                    {/* Cabecera de la card */}
                    <div style={{
                        backgroundColor: '#1a2b4a',
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{ fontSize: '28px' }}>
                            {ICONOS[v.tipo_vehiculo] || '🚗'}
                        </span>
                        <span style={{
                            backgroundColor: '#3b82f6',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            textTransform: 'capitalize',
                        }}>
                            {v.tipo_vehiculo}
                        </span>
                    </div>

                    {/* Cuerpo */}
                    <div style={{ padding: '14px 16px' }}>

                        <p style={{
                            margin: '0 0 4px',
                            fontWeight: '600',
                            fontSize: '15px',
                            color: '#111827',
                        }}>
                            {v.marca} {v.modelo}
                        </p>

                        <p style={{
                            margin: '0 0 10px',
                            color: '#9ca3af',
                            fontSize: '13px',
                        }}>
                            Año {v.anio}
                        </p>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}>
                            <span style={{
                                fontWeight: '700',
                                fontSize: '16px',
                                color: '#16a34a',
                            }}>
                                S/ {parseFloat(v.precio_alquiler).toFixed(2)}
                                <span style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                }}>/día</span>
                            </span>

                            <span style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                padding: '3px 8px',
                                borderRadius: '20px',
                                backgroundColor: v.disponible ? '#dcfce7' : '#fee2e2',
                                color: v.disponible ? '#166534' : '#dc2626',
                            }}>
                                {v.disponible ? 'Disponible' : 'No disponible'}
                            </span>
                        </div>

                        <p style={{ margin: '0 0 14px' }}>
                            <span style={{
                                fontFamily: 'monospace',
                                fontSize: '13px',
                                fontWeight: '600',
                                backgroundColor: '#f3f4f6',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                border: '1px solid #e5e7eb',
                            }}>
                                {v.placa}
                            </span>
                        </p>

                    </div>

                    {/* Acciones */}
                    <div style={{
                        padding: '0 16px 14px',
                        display: 'flex',
                        gap: '8px',
                    }}>

                        <button
                            onClick={() => editarVehiculo(v)}
                            style={{
                                flex: 1,
                                padding: '7px',
                                backgroundColor: '#fff',
                                color: '#2563eb',
                                border: '1.5px solid #bfdbfe',
                                borderRadius: '7px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                            }}
                        >
                            ✏️ Editar
                        </button>

                        <button
                            onClick={() => eliminarVehiculo(v.id)}
                            style={{
                                flex: 1,
                                padding: '7px',
                                backgroundColor: '#fff',
                                color: '#dc2626',
                                border: '1.5px solid #fecaca',
                                borderRadius: '7px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                            }}
                        >
                            🗑️ Eliminar
                        </button>

                    </div>

                </div>

            ))}

        </div>

    );

}