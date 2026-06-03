import { useContext } from 'react';
import VehiculoContext from '../context/VehiculoContext';

const ESTADOS      = ['disponible','reservado','alquilado','mantenimiento','inactivo'];
const COMBUSTIBLES = ['Gasolina','Diesel','GLP','GNV','Eléctrico','Híbrido'];
const TRANSMISIONES= ['Manual','Automático','Semiautomático'];

const inp = { width:'100%', padding:'0.55rem 0.75rem', border:'1px solid #d1d5db', borderRadius:8, fontSize:13, boxSizing:'border-box' };
const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#6b7280', textTransform:'uppercase', marginBottom:3 };

function Vehiculo() {
    const {
        form, modoEdicion, alerta,
        categorias = [],
        handleInputChange, resetForm,
        crearVehiculo, actualizarVehiculo,
    } = useContext(VehiculoContext);

    return (
        <div style={{ background:'#fff', borderRadius:14, padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
            <h3 style={{ color:'#1a1a2e', marginTop:0 }}>
                {modoEdicion ? ' Editar Vehículo' : ' Registrar Vehículo'}
            </h3>

            {/* Alerta */}
            {alerta?.msg && (
                <div style={{
                    padding:'0.65rem 1rem', borderRadius:8, marginBottom:'1rem', fontSize:13,
                    background: alerta.error ? '#fef2f2' : '#f0fdf4',
                    color:      alerta.error ? '#dc2626' : '#16a34a',
                    border:    `1px solid ${alerta.error ? '#fecaca' : '#bbf7d0'}`,
                }}>
                    {alerta.error ? '❌' : '✅'} {alerta.msg}
                </div>
            )}

            <form onSubmit={modoEdicion ? actualizarVehiculo : crearVehiculo}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>

                    {/* Categoría */}
                    <div style={{ gridColumn:'1/-1' }}>
                        <label style={lbl}>Categoría *</label>
                        <select name="id_categoria" value={form.id_categoria} onChange={handleInputChange} required style={inp}>
                            <option value="">-- Seleccionar --</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Marca */}
                    <div>
                        <label style={lbl}>Marca *</label>
                        <input type="text" name="marca" value={form.marca} onChange={handleInputChange}
                            required placeholder="Honda" style={inp} />
                    </div>

                    {/* Modelo */}
                    <div>
                        <label style={lbl}>Modelo *</label>
                        <input type="text" name="modelo" value={form.modelo} onChange={handleInputChange}
                            required placeholder="CB190" style={inp} />
                    </div>

                    {/* Placa */}
                    <div>
                        <label style={lbl}>Placa *</label>
                        <input type="text" name="placa" value={form.placa} onChange={handleInputChange}
                            required placeholder="ABC-123" maxLength={15}
                            style={{ ...inp, textTransform:'uppercase' }} />
                    </div>

                    {/* Año */}
                    <div>
                        <label style={lbl}>Año *</label>
                        <input type="number" name="anio" value={form.anio} onChange={handleInputChange}
                            required min={1990} max={new Date().getFullYear()} style={inp} />
                    </div>

                    {/* Color */}
                    <div>
                        <label style={lbl}>Color</label>
                        <input type="text" name="color" value={form.color} onChange={handleInputChange}
                            placeholder="Rojo" style={inp} />
                    </div>

                    {/* Precio */}
                    <div>
                        <label style={lbl}>Precio diario (S/) *</label>
                        <input type="number" name="precio_diario" value={form.precio_diario} onChange={handleInputChange}
                            required min={0.01} step={0.01} placeholder="50.00" style={inp} />
                    </div>

                    {/* Combustible */}
                    <div>
                        <label style={lbl}>Combustible</label>
                        <select name="tipo_combustible" value={form.tipo_combustible} onChange={handleInputChange} style={inp}>
                            <option value="">-- Tipo --</option>
                            {COMBUSTIBLES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Transmisión */}
                    <div>
                        <label style={lbl}>Transmisión</label>
                        <select name="transmision" value={form.transmision} onChange={handleInputChange} style={inp}>
                            <option value="">-- Tipo --</option>
                            {TRANSMISIONES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Pasajeros */}
                    <div>
                        <label style={lbl}>Pasajeros</label>
                        <input type="number" name="capacidad_pasajeros" value={form.capacidad_pasajeros}
                            onChange={handleInputChange} min={1} max={20} style={inp} />
                    </div>

                    {/* Kilometraje */}
                    <div>
                        <label style={lbl}>Kilometraje (km)</label>
                        <input type="number" name="kilometraje" value={form.kilometraje}
                            onChange={handleInputChange} min={0} step={0.01} style={inp} />
                    </div>

                    {/* Estado */}
                    <div style={{ gridColumn:'1/-1' }}>
                        <label style={lbl}>Estado</label>
                        <select name="estado" value={form.estado} onChange={handleInputChange} style={inp}>
                            {ESTADOS.map(e => (
                                <option key={e} value={e}>
                                    {e.charAt(0).toUpperCase() + e.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones */}
                <div style={{ display:'flex', gap:'0.5rem', marginTop:'1rem' }}>
                    <button type="submit"
                        style={{ flex:1, padding:'0.65rem', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer' }}>
                        {modoEdicion ? 'Actualizar' : 'Registrar'}
                    </button>
                    {modoEdicion && (
                        <button type="button" onClick={resetForm}
                            style={{ flex:1, padding:'0.65rem', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer' }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Vehiculo;