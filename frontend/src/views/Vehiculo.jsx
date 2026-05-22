import useVehiculo from "../hooks/useVehiculo";
import ListaVehiculos from './ListaVehiculos';

const ANIO_MIN = 1990;
const ANIO_MAX = new Date().getFullYear();

export default function Vehiculo() {

    // Conexión con el Provider
    const {
        vehiculos,
        form,
        alerta,
        cargando,
        modoEdicion,
        handleInputChange,
        crearVehiculo,
        actualizarVehiculo,
        resetForm,
    } = useVehiculo();

    // ── Estilos reutilizables ──────────────────────────────
    const inputStyle = {
        display: 'block',
        width: '100%',
        padding: '9px 12px',
        marginTop: '4px',
        border: '1.5px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    };

    const labelStyle = {
        fontSize: '12px',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    };

    return (

        <div style={{ minHeight: '100vh', backgroundColor: '#f5f4f0' }}>

            {/* ── NAVBAR ──────────────────────────────────── */}
            <nav style={{
                backgroundColor: '#1a2b4a',
                padding: '14px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '18px',
                }}>
                    RentalVehiAndino
                </span>
                <span style={{ color: '#93c5fd', fontSize: '13px' }}>
                    {vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} registrado{vehiculos.length !== 1 ? 's' : ''}
                </span>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>

                {/* ── ALERTA ──────────────────────────────── */}
                {alerta.msg && (
                    <div style={{
                        padding: '12px 16px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        backgroundColor: alerta.error ? '#fef2f2' : '#f0fdf4',
                        color: alerta.error ? '#dc2626' : '#16a34a',
                        border: `1px solid ${alerta.error ? '#fecaca' : '#bbf7d0'}`,
                        fontSize: '14px',
                    }}>
                        {alerta.error ? '' : ''} {alerta.msg}
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '340px 1fr',
                    gap: '24px',
                    alignItems: 'start',
                }}>

                    {/* ── FORMULARIO ──────────────────────── */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '14px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #e5e7eb',
                    }}>

                        <h2 style={{
                            margin: '0 0 20px',
                            fontSize: '17px',
                            fontWeight: '700',
                            color: '#111827',
                        }}>
                            {modoEdicion ? ' Editar Vehículo' : ' Registrar Vehículo'}
                        </h2>

                        <form onSubmit={modoEdicion ? actualizarVehiculo : crearVehiculo}>

                            {/* TIPO */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Tipo de vehículo *</label>
                                <select
                                    name="tipo_vehiculo"
                                    value={form.tipo_vehiculo}
                                    onChange={handleInputChange}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="carro"> Carro</option>
                                    <option value="moto"> Moto</option>
                                    <option value="mototaxi"> Mototaxi</option>
                                    <option value="bicicleta"> Bicicleta</option>
                                    <option value="scooter"> Scooter</option>
                                </select>
                            </div>

                            {/* MARCA */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Marca *</label>
                                <input
                                    type="text"
                                    name="marca"
                                    value={form.marca}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Honda"
                                    style={inputStyle}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            {/* MODELO */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Modelo *</label>
                                <input
                                    type="text"
                                    name="modelo"
                                    value={form.modelo}
                                    onChange={handleInputChange}
                                    placeholder="Ej: CB190"
                                    style={inputStyle}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            {/* AÑO y PLACA en grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                                marginBottom: '14px',
                            }}>
                                <div>
                                    <label style={labelStyle}>Año *</label>
                                    <input
                                        type="number"
                                        name="anio"
                                        value={form.anio}
                                        onChange={handleInputChange}
                                        min={ANIO_MIN}
                                        max={ANIO_MAX}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Placa *</label>
                                    <input
                                        type="text"
                                        name="placa"
                                        value={form.placa}
                                        onChange={handleInputChange}
                                        placeholder="ABC-123"
                                        style={{ ...inputStyle, textTransform: 'uppercase' }}
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {/* PRECIO */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Precio por día (S/) *</label>
                                <input
                                    type="number"
                                    name="precio_alquiler"
                                    value={form.precio_alquiler}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min={0.01}
                                    step={0.01}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            {/* DISPONIBLE */}
                            <div style={{
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}>
                                <input
                                    type="checkbox"
                                    name="disponible"
                                    id="disponible"
                                    checked={form.disponible}
                                    onChange={handleInputChange}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <label
                                    htmlFor="disponible"
                                    style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}
                                >
                                    Disponible para alquiler
                                </label>
                            </div>

                            {/* BOTONES */}
                            <div style={{ display: 'flex', gap: '10px' }}>

                                <button
                                    type="submit"
                                    disabled={cargando}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#1a2b4a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: cargando ? 'not-allowed' : 'pointer',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        opacity: cargando ? 0.7 : 1,
                                    }}
                                >
                                    {cargando
                                        ? 'Guardando...'
                                        : (modoEdicion ? 'Actualizar' : 'Registrar')}
                                </button>

                                {modoEdicion && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: '#fff',
                                            color: '#6b7280',
                                            border: '1.5px solid #e5e7eb',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>

                    {/* ── LISTA DE VEHÍCULOS ───────────────── */}
                    <div>
                        <h2 style={{
                            margin: '0 0 4px',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#111827',
                        }}>
                            Vehículos registrados
                        </h2>
                        <p style={{ margin: '0 0 16px', color: '#9ca3af', fontSize: '13px' }}>
                            {vehiculos.length} en total
                        </p>

                        <ListaVehiculos />
                    </div>

                </div>

            </div>

        </div>

    );

}