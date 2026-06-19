import { useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import clienteAxios from '../config/axios';

const API_BACKEND = 'http://127.0.0.1:8000';

function imagenUrl(path) {
    if (!path) return '/vehiculo-default.png';
    const img = String(path).trim();
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${API_BACKEND}/storage/${img.replace(/^\/?storage\//, '')}`;
}

function hoyISO() {
    return new Date().toISOString().slice(0, 10);
}

const MENU_CLIENTE = [
    { id: 'dashboard-cliente', label: 'Inicio' },
    { id: 'buscar-vehiculos', label: 'Buscar Vehículos' },
    { id: 'mis-reservas', label: 'Mis Reservas' },
    { id: 'mis-alquileres', label: 'Mis Alquileres' },
    { id: 'mis-pagos', label: 'Mis Pagos' },
    { id: 'mi-perfil', label: 'Mi Perfil' },
];

const card = {
    background: '#fff',
    borderRadius: 16,
    padding: '1rem',
    boxShadow: '0 3px 14px rgba(0,0,0,.08)',
};

const btnPrimary = {
    padding: '0.7rem 1rem',
    background: '#ffb84d',
    color: '#111827',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 800,
};

const btnSoft = {
    padding: '0.55rem 0.8rem',
    background: '#fff7ed',
    color: '#ff4d00',
    border: '1px solid #fed7aa',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 700,
};

const input = {
    padding: '0.7rem',
    border: '1px solid #d1d5db',
    borderRadius: 10,
    fontSize: 14,
    boxSizing: 'border-box',
    width: '100%',
};

function formatDate(value) {
    if (!value) return '—';
    return String(value).slice(0, 10);
}

function money(value) {
    return `S/ ${Number(value || 0).toFixed(2)}`;
}

function safeText(value) {
    return String(value ?? '—')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function imprimirComprobantePago(pago) {
    const alquiler = pago?.alquiler || {};
    const cliente = alquiler?.cliente?.persona || {};
    const vehiculo = alquiler?.vehiculo || {};

    const clienteNombre = `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || 'Cliente';
    const montoAlquiler = Number(alquiler.monto_total || 0);
    const penalidad = Number(alquiler.penalidad || 0);
    const totalPagado = Number(pago?.monto || (montoAlquiler + penalidad));
    const numeroComprobante = `REC-${String(pago?.id || '000').padStart(6, '0')}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Comprobante ${safeText(numeroComprobante)}</title>
            <style>
                body { font-family: Arial, sans-serif; background:#f3f4f6; margin:0; padding:30px; color:#111827; }
                .recibo { max-width:760px; margin:auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 10px 35px rgba(0,0,0,.12); }
                .header { background:#111827; color:#fff; padding:26px 32px; display:flex; justify-content:space-between; gap:20px; }
                .header h1 { margin:0; font-size:25px; }
                .header p { margin:6px 0 0; color:#d1d5db; }
                .badge { background:#dcfce7; color:#166534; padding:8px 14px; border-radius:999px; font-weight:700; font-size:13px; align-self:flex-start; }
                .body { padding:30px 32px; }
                .grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:20px; }
                .box { border:1px solid #e5e7eb; border-radius:12px; padding:16px; background:#f9fafb; }
                .box h3 { margin:0 0 10px; font-size:15px; color:#374151; }
                .row { display:flex; justify-content:space-between; gap:16px; padding:8px 0; border-bottom:1px dashed #e5e7eb; }
                .row:last-child { border-bottom:0; }
                .label { color:#6b7280; }
                .value { font-weight:700; text-align:right; }
                .total { margin-top:20px; border:2px solid #ffb84d; border-radius:14px; padding:18px; background:#fff7ed; }
                .total .row { font-size:18px; border-bottom:0; }
                .footer { padding:18px 32px 28px; color:#6b7280; font-size:13px; text-align:center; }
                .acciones { max-width:760px; margin:18px auto 0; display:flex; justify-content:center; gap:10px; }
                button { padding:10px 16px; border:0; border-radius:10px; cursor:pointer; font-weight:700; }
                .print { background:#ffb84d; color:#111827; }
                .close { background:#e5e7eb; color:#111827; }
                @media print {
                    body { background:#fff; padding:0; }
                    .recibo { box-shadow:none; border-radius:0; }
                    .acciones { display:none; }
                }
            </style>
        </head>
        <body>
            <div class="recibo">
                <div class="header">
                    <div>
                        <h1>Comprobante de Pago</h1>
                        <p>Sistema de Gestión de Alquiler de Vehículos</p>
                        <p><b>N.º:</b> ${safeText(numeroComprobante)}</p>
                    </div>
                    <div class="badge">${safeText(pago?.estado || 'aprobado').toUpperCase()}</div>
                </div>

                <div class="body">
                    <div class="grid">
                        <div class="box">
                            <h3>Datos del cliente</h3>
                            <div class="row"><span class="label">Cliente</span><span class="value">${safeText(clienteNombre)}</span></div>
                            <div class="row"><span class="label">DNI</span><span class="value">${safeText(cliente.dni)}</span></div>
                            <div class="row"><span class="label">Correo</span><span class="value">${safeText(cliente.correo)}</span></div>
                        </div>
                        <div class="box">
                            <h3>Datos del pago</h3>
                            <div class="row"><span class="label">Fecha</span><span class="value">${safeText(formatDate(pago?.fecha_pago))}</span></div>
                            <div class="row"><span class="label">Método</span><span class="value">${safeText(pago?.metodo_pago)}</span></div>
                            <div class="row"><span class="label">Nro. operación</span><span class="value">${safeText(pago?.nro_operacion)}</span></div>
                        </div>
                    </div>

                    <div class="box">
                        <h3>Detalle del alquiler</h3>
                        <div class="row"><span class="label">Vehículo</span><span class="value">${safeText(`${vehiculo.marca || ''} ${vehiculo.modelo || ''}`.trim())}</span></div>
                        <div class="row"><span class="label">Placa</span><span class="value">${safeText(vehiculo.placa)}</span></div>
                        <div class="row"><span class="label">Fecha salida</span><span class="value">${safeText(formatDate(alquiler.fecha_salida))}</span></div>
                        <div class="row"><span class="label">Devolución programada</span><span class="value">${safeText(formatDate(alquiler.fecha_devolucion_programada))}</span></div>
                    </div>

                    <div class="total">
                        <div class="row"><span class="label">Monto alquiler</span><span class="value">${safeText(money(montoAlquiler))}</span></div>
                        <div class="row"><span class="label">Penalidad</span><span class="value">${safeText(money(penalidad))}</span></div>
                        <div class="row"><span class="label"><b>Total pagado</b></span><span class="value">${safeText(money(totalPagado))}</span></div>
                    </div>
                </div>

                <div class="footer">
                    Este documento es un comprobante interno del sistema. No representa una factura electrónica SUNAT.
                </div>
            </div>
            <div class="acciones">
                <button class="print" onclick="window.print()">Imprimir / Guardar PDF</button>
                <button class="close" onclick="window.close()">Cerrar</button>
            </div>
        </body>
        </html>
    `;

    const ventana = window.open('', '_blank', 'width=900,height=900');
    if (!ventana) {
        alert('El navegador bloqueó la ventana emergente del comprobante. Permite pop-ups para este sitio.');
        return;
    }

    ventana.document.open();
    ventana.document.write(html);
    ventana.document.close();
    ventana.focus();
}


function DashboardCliente({ vehiculos, reservas, alquileres, pagos, irBuscar }) {
    const cards = [
        ['Vehículos disponibles', vehiculos.filter(v => v.estado === 'disponible').length],
        ['Reservas activas', reservas.filter(r => ['pendiente', 'confirmada'].includes(r.estado)).length],
        ['Alquileres en curso', alquileres.filter(a => a.estado === 'activo').length],
        ['Pagos pendientes', pagos.filter(p => p.estado === 'pendiente').length],
    ];

    return (
        <div>
            <section style={{
                width: '100%',
                minHeight: 260,
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: 'linear-gradient(90deg, rgba(17,24,39,.86), rgba(17,24,39,.38)), url("/banner-autos.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                padding: '2.5rem',
                boxSizing: 'border-box',
                marginBottom: '1.5rem'
            }}>
                <div style={{ maxWidth: 640, color: '#fff' }}>
                    <p style={{ margin: 0, fontWeight: 800, color: '#ffb84d' }}>Encuentra tu vehículo ideal</p>
                    <h1 style={{ margin: '0.5rem 0', fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.05 }}>
                        Alquila rápido, seguro y al mejor precio
                    </h1>
                    <p style={{ fontSize: 16, maxWidth: 520 }}>
                        Automóviles, motos, mototaxis, bicicletas y scooters disponibles para tus viajes.
                    </p>
                    <button onClick={irBuscar} style={btnPrimary}>Buscar vehículos ahora</button>
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {cards.map(([title, value]) => (
                    <div key={title} style={card}>
                        <p style={{ color: '#777', margin: 0 }}>{title}</p>
                        <h2 style={{ margin: '0.5rem 0 0', color: '#ff4d00' }}>{value}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BuscarVehiculos({ vehiculos, onReservar }) {
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [orden, setOrden] = useState('');

    const categorias = useMemo(() => {
        const mapa = new Map();
        vehiculos.forEach(v => {
            if (v.categoria) mapa.set(v.categoria.id, v.categoria.nombre);
        });
        return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
    }, [vehiculos]);

    const vehiculosFiltrados = useMemo(() => {
        let lista = vehiculos.filter(v => v.estado === 'disponible');

        if (busqueda.trim()) {
            const q = busqueda.toLowerCase();
            lista = lista.filter(v => `${v.marca} ${v.modelo} ${v.placa}`.toLowerCase().includes(q));
        }

        if (categoria) lista = lista.filter(v => String(v.id_categoria) === String(categoria));
        if (orden === 'menor') lista = [...lista].sort((a, b) => Number(a.precio_diario) - Number(b.precio_diario));
        if (orden === 'mayor') lista = [...lista].sort((a, b) => Number(b.precio_diario) - Number(a.precio_diario));

        return lista;
    }, [vehiculos, busqueda, categoria, orden]);

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Buscar Vehículos</h2>

            <div style={{ ...card, marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar marca, modelo o placa" style={{ ...input, flex: '1 1 260px' }} />
                <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ ...input, width: 'auto' }}>
                    <option value="">Todas las categorías</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                <select value={orden} onChange={e => setOrden(e.target.value)} style={{ ...input, width: 'auto' }}>
                    <option value="">Ordenar precio</option>
                    <option value="menor">Menor precio</option>
                    <option value="mayor">Mayor precio</option>
                </select>
            </div>

            {vehiculosFiltrados.length === 0 ? (
                <div style={{ ...card, textAlign: 'center', color: '#777' }}>No hay vehículos disponibles para esta búsqueda.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
                    {vehiculosFiltrados.map(v => (
                        <div key={v.id} style={{
                            background: '#fff',
                            borderRadius: 16,
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0,0,0,.08)',
                            textAlign: 'center',
                            padding: '1rem'
                        }}>
                            <img
                                src={imagenUrl(v.imagen)}
                                alt={`${v.marca} ${v.modelo}`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/vehiculo-default.png';
                                }}
                                style={{ width: '100%', height: '180px', objectFit: 'contain' }}
                            />

                            <h3 style={{ marginTop: '1rem', color: '#1a2f6b', fontSize: '22px' }}>
                                {v.marca} {v.modelo}
                            </h3>

                            <p style={{ color: '#777' }}>Placa: {v.placa}</p>

                            <div style={{
                                background: v.estado === 'disponible' ? '#dcfce7' : '#fee2e2',
                                color: v.estado === 'disponible' ? '#166534' : '#991b1b',
                                padding: '6px 12px',
                                borderRadius: 20,
                                display: 'inline-block',
                                fontWeight: 'bold',
                                marginBottom: '1rem'
                            }}>
                                {v.estado}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                margin: '1rem 0',
                                color: '#1a2f6b',
                                fontWeight: 600
                            }}>
                                <span>🚗 {v.categoria?.nombre || 'Sin categoría'}</span>
                                <span>👥 {v.capacidad_pasajeros || 1}</span>
                                <span>⚙️ {v.transmision || '—'}</span>
                                <span>⛽ {v.tipo_combustible || '—'}</span>
                            </div>

                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                                S/ {parseFloat(v.precio_diario || 0).toFixed(2)}
                            </div>

                            <div style={{ color: '#666', marginBottom: '1rem' }}>por día</div>

                            <button
                                onClick={() => onReservar(v)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: '#ff4d00',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Reservar ahora
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ModalReserva({ vehiculo, fechaFin, setFechaFin, onCerrar, onConfirmar, enviando }) {
    const hoy = hoyISO();

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.55)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '1rem'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 18,
                width: '100%',
                maxWidth: 430,
                boxShadow: '0 20px 60px rgba(0,0,0,.25)',
                overflow: 'hidden'
            }}>
                <div style={{
                    background: '#111827',
                    color: '#fff',
                    padding: '1rem 1.3rem'
                }}>
                    <h2 style={{ margin: 0, fontSize: 20 }}>Reservar vehículo</h2>
                    <p style={{ margin: '0.3rem 0 0', color: '#d1d5db', fontSize: 13 }}>
                        Seleccione la fecha de finalización del alquiler.
                    </p>
                </div>

                <div style={{ padding: '1.4rem' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: '1rem' }}>
                        <img
                            src={imagenUrl(vehiculo?.imagen)}
                            alt={`${vehiculo?.marca} ${vehiculo?.modelo}`}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/vehiculo-default.png';
                            }}
                            style={{
                                width: 95,
                                height: 70,
                                objectFit: 'contain',
                                background: '#f9fafb',
                                borderRadius: 12,
                                border: '1px solid #e5e7eb'
                            }}
                        />

                        <div>
                            <h3 style={{ margin: 0, color: '#111827' }}>
                                {vehiculo?.marca} {vehiculo?.modelo}
                            </h3>
                            <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: 13 }}>
                                Placa: {vehiculo?.placa}
                            </p>
                            <b style={{ color: '#16a34a' }}>
                                {money(vehiculo?.precio_diario)} / día
                            </b>
                        </div>
                    </div>

                    <label style={{ fontWeight: 800, color: '#374151', fontSize: 13 }}>
                        Fecha de inicio
                    </label>
                    <input
                        type="date"
                        value={hoy}
                        disabled
                        style={{ ...input, marginTop: 6, background: '#f3f4f6', color: '#6b7280' }}
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ fontWeight: 800, color: '#374151', fontSize: 13 }}>
                            Fecha de finalización
                        </label>
                        <input
                            type="date"
                            min={hoy}
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            style={{ ...input, marginTop: 6 }}
                        />
                    </div>

                    <div style={{
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        color: '#9a3412',
                        borderRadius: 12,
                        padding: '0.8rem',
                        marginTop: '1rem',
                        fontSize: 13
                    }}>
                        La fecha de inicio se registra automáticamente con la fecha actual.
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10,
                        marginTop: '1.3rem'
                    }}>
                        <button onClick={onCerrar} disabled={enviando} style={btnSoft}>
                            Cancelar
                        </button>

                        <button onClick={onConfirmar} disabled={enviando} style={btnPrimary}>
                            {enviando ? 'Registrando...' : 'Confirmar reserva'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MisReservas({ reservas, onCancelar }) {
    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Mis Reservas</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {reservas.length === 0 && <div style={card}>No tienes reservas registradas.</div>}
                {reservas.map(r => (
                    <div key={r.id} style={card}>
                        <h3 style={{ marginTop: 0 }}>{r.vehiculo?.marca} {r.vehiculo?.modelo}</h3>
                        <p>Fecha inicio: {formatDate(r.fecha_inicio)} | Fecha fin: {formatDate(r.fecha_fin)}</p>
                        <p>Total estimado: <b>{money(r.total_estimado)}</b></p>
                        <p>Estado: <b>{r.estado}</b></p>
                        {r.estado === 'pendiente' && (
                            <button onClick={() => onCancelar(r.id)} style={btnSoft}>Cancelar reserva</button>
                        )}
                        {r.estado === 'confirmada' && (
                            <p style={{ color: '#16a34a', fontWeight: 700 }}>
                                Reserva confirmada. El administrador gestionará el alquiler.
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MisAlquileres({ alquileres }) {
    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Mis Alquileres</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {alquileres.length === 0 && <div style={card}>No tienes alquileres registrados.</div>}
                {alquileres.map(a => (
                    <div key={a.id} style={card}>
                        <h3 style={{ marginTop: 0 }}>{a.vehiculo?.marca} {a.vehiculo?.modelo}</h3>
                        <p>Salida: {formatDate(a.fecha_salida)} | Devolución programada: {formatDate(a.fecha_devolucion_programada)}</p>
                        <p>Monto: <b>{money(a.monto_total)}</b> | Penalidad: <b>{money(a.penalidad)}</b></p>
                        <p>Estado: <b>{a.estado}</b></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FormPagoCliente({ alquileres, pagos, onPagoCreado }) {
    const idsAlquileresPagados = pagos
        .filter(p => ['pendiente', 'aprobado', 'pagado'].includes(p.estado))
        .map(p => Number(p.id_alquiler));
    
    const alquileresPagables = alquileres.filter(a =>
        ['activo', 'finalizado'].includes(a.estado) &&
        !idsAlquileresPagados.includes(Number(a.id))
    );    

    const [form, setForm] = useState({
        id_alquiler: '',
        metodo_pago: 'yape',
        nro_operacion: '',
    });
    const [enviando, setEnviando] = useState(false);

    const alquilerSeleccionado = alquileresPagables.find(a => String(a.id) === String(form.id_alquiler));
    const montoAlquiler = Number(alquilerSeleccionado?.monto_total || 0);
    const penalidad = Number(alquilerSeleccionado?.penalidad || 0);
    const montoAutomatico = montoAlquiler + penalidad;

    const enviarPago = async (e) => {
        e.preventDefault();

        if (!form.id_alquiler) {
            alert('Seleccione un alquiler para realizar el pago.');
            return;
        }

        try {
            setEnviando(true);
            await clienteAxios.post('/pagos', {
                id_alquiler: form.id_alquiler,
                metodo_pago: form.metodo_pago,
                nro_operacion: form.nro_operacion,
            });

            alert('Pago enviado correctamente. El administrador validará el pago.');
            setForm({ id_alquiler: '', metodo_pago: 'yape', nro_operacion: '' });
            await onPagoCreado();
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo enviar el pago.');
            console.error(error.response?.data || error);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form onSubmit={enviarPago} style={{ ...card, marginBottom: '1rem', padding: '1.3rem' }}>
            <h3 style={{ margin: '0 0 1rem', textAlign: 'center', color: '#5b566e' }}>Finalizar pago</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .7fr', gap: '1rem', alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                    <label style={{ fontWeight: 800, color: '#6b7280' }}>Alquiler a pagar</label>
                    <select
                        required
                        value={form.id_alquiler}
                        onChange={e => setForm({ ...form, id_alquiler: e.target.value })}
                        style={input}
                    >
                        <option value="">Seleccione alquiler</option>
                        {alquileresPagables.map(a => (
                            <option key={a.id} value={a.id}>
                                #{a.id} - {a.vehiculo?.marca} {a.vehiculo?.modelo} - {money(a.monto_total)}
                            </option>
                        ))}
                    </select>

                    {alquilerSeleccionado && (
                        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0.9rem' }}>
                            <b>{alquilerSeleccionado.vehiculo?.marca} {alquilerSeleccionado.vehiculo?.modelo}</b>
                            <p style={{ margin: '0.3rem 0 0', color: '#6b7280' }}>
                                Salida: {formatDate(alquilerSeleccionado.fecha_salida)} · Devolución: {formatDate(alquilerSeleccionado.fecha_devolucion_programada)}
                            </p>
                        </div>
                    )}

                    <label style={{ fontWeight: 800, color: '#6b7280' }}>Forma de pago</label>

                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        {[
                            ['yape', 'Yape'],
                            ['plin', 'Plin'],
                            ['transferencia', 'Transferencia bancaria'],
                            ['tarjeta', 'Pago con tarjeta'],
                            ['efectivo', 'Efectivo'],
                        ].map(([value, label]) => (
                            <label key={value} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                border: '1px solid #e5e7eb',
                                borderRadius: 12,
                                padding: '0.85rem',
                                cursor: 'pointer',
                                background: form.metodo_pago === value ? '#fff7ed' : '#fff'
                            }}>
                                <input
                                    type="radio"
                                    name="metodo_pago"
                                    value={value}
                                    checked={form.metodo_pago === value}
                                    onChange={e => setForm({ ...form, metodo_pago: e.target.value })}
                                />
                                <b>{label}</b>
                            </label>
                        ))}
                    </div>

                    {form.metodo_pago !== 'efectivo' && (
                        <input
                            placeholder="Nro. operación"
                            value={form.nro_operacion}
                            onChange={e => setForm({ ...form, nro_operacion: e.target.value })}
                            style={input}
                        />
                    )}
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 16, padding: '1rem', position: 'sticky', top: 15 }}>
                    <h4 style={{ margin: '0 0 0.8rem', color: '#374151' }}>Resumen</h4>
                    <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
                        <span>Monto del alquiler</span>
                        <b>{money(montoAlquiler)}</b>
                    </p>
                    <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
                        <span>Penalidad</span>
                        <b>{money(penalidad)}</b>   
                    </p>
                    <hr style={{ border: 0, borderTop: '1px solid #e5e7eb' }} />
                    <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}>
                        <span>Total a pagar</span>
                        <b style={{ color: '#ff4d00' }}>{money(montoAutomatico)}</b>
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>
                        El monto se calcula automáticamente desde el alquiler seleccionado. No se solicita imagen ni observación.
                    </p>
                    <button disabled={enviando || !form.id_alquiler} style={{ ...btnPrimary, width: '100%' }}>
                        {enviando ? 'Enviando pago...' : 'Enviar pago para validación'}
                    </button>
                </div>
            </div>
        </form>
    );
}

function MisPagos({ pagos, alquileres, onPagoCreado }) {
    const estadoColor = {
        pendiente: '#f59e0b',
        aprobado: '#16a34a',
        rechazado: '#dc2626',
        anulado: '#6b7280',
        pagado: '#16a34a',
    };

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Mis Pagos</h2>

            <FormPagoCliente alquileres={alquileres} pagos={pagos} onPagoCreado={onPagoCreado} />

            <div style={{ display: 'grid', gap: '1rem' }}>
                {pagos.length === 0 && <div style={card}>No tienes pagos registrados.</div>}

                {pagos.map(p => (
                    <div key={p.id} style={card}>
                        <h3 style={{ marginTop: 0 }}>{p.alquiler?.vehiculo?.marca} {p.alquiler?.vehiculo?.modelo}</h3>
                        <p>Fecha: {formatDate(p.fecha_pago)} | Método: <b>{p.metodo_pago}</b></p>
                        <p>Monto: <b>{money(p.monto)}</b> | Estado: <b style={{ color: estadoColor[p.estado] || '#111827' }}>{p.estado}</b></p>
                        {p.nro_operacion && <p>Nro. operación: <b>{p.nro_operacion}</b></p>}
                        {['aprobado', 'pagado'].includes(p.estado) && (
                            <button
                                type="button"
                                onClick={() => imprimirComprobantePago(p)}
                                style={{ ...btnSoft, marginTop: '0.5rem' }}
                            >
                                Ver comprobante
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function DatoPerfil({ label, value }) {
    return (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0.9rem' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6b7280', fontWeight: 700 }}>{label}</p>
            <p style={{ margin: '0.3rem 0 0', color: '#111827', fontWeight: 600 }}>{value || '—'}</p>
        </div>
    );
}

function MiPerfil({ perfil }) {
    const persona = perfil?.persona || {};
    const cliente = perfil?.cliente || {};
    const nombreCompleto = perfil?.nombre || `${persona.nombres || ''} ${persona.apellidos || ''}`.trim() || 'Cliente';

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>Mi Perfil</h2>

            <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.10)', width: '100%', maxWidth: '100%' }}>
                <div style={{
                    height: 135,
                    background: 'linear-gradient(135deg, rgba(186,230,253,.9), rgba(224,242,254,.9)), url("/banner-autos.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        left: 32,
                        bottom: -42,
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        background: '#d1d5db',
                        border: '5px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 42,
                        boxShadow: '0 4px 10px rgba(0,0,0,.12)'
                    }}>
                        👤
                    </div>
                </div>

                <div style={{ padding: '3.4rem 2rem 2rem' }}>
                    <h2 style={{ margin: 0, color: '#111827' }}>{nombreCompleto}</h2>
                    <p style={{ margin: '0.25rem 0 1.5rem', color: '#6b7280' }}>@{perfil?.usuario || 'cliente'}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                        <DatoPerfil label="DNI" value={persona.dni} />
                        <DatoPerfil label="Correo" value={persona.correo || perfil?.correo} />
                        <DatoPerfil label="Teléfono" value={persona.telefono} />
                        <DatoPerfil label="Dirección" value={persona.direccion} />
                        <DatoPerfil label="Licencia" value={cliente.licencia_conducir} />
                        <DatoPerfil label="Vencimiento licencia" value={formatDate(cliente.fecha_vencimiento_licencia)} />
                        <DatoPerfil label="Rol" value={perfil?.rol || 'cliente'} />
                        <DatoPerfil label="Estado" value="Activo" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PanelCliente() {
    const { auth, logout } = useAuth();

    const [seccion, setSeccion] = useState('dashboard-cliente');
    const [vehiculos, setVehiculos] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [pagos, setPagos] = useState([]);
    const [perfil, setPerfil] = useState(auth);
    const [cargando, setCargando] = useState(false);

    const [modalReserva, setModalReserva] = useState(false);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [fechaFin, setFechaFin] = useState('');
    const [registrandoReserva, setRegistrandoReserva] = useState(false);

    const cargarDatos = async () => {
        setCargando(true);

        try {
            const respuestas = await Promise.allSettled([
                clienteAxios.get('/vehiculos'),
                clienteAxios.get('/reservas'),
                clienteAxios.get('/alquileres'),
                clienteAxios.get('/pagos'),
                clienteAxios.get('/me'),
            ]);

            const data = (i, fallback = []) =>
                respuestas[i].status === 'fulfilled' ? respuestas[i].value.data : fallback;

            setVehiculos(Array.isArray(data(0)) ? data(0) : []);
            setReservas(Array.isArray(data(1)) ? data(1) : []);
            setAlquileres(Array.isArray(data(2)) ? data(2) : []);
            setPagos(Array.isArray(data(3)) ? data(3) : []);
            setPerfil(data(4, auth) || auth);
        } catch (error) {
            console.error('Error al cargar datos del cliente', error.response?.data || error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reservarVehiculo = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setFechaFin('');
        setModalReserva(true);
    };

    const confirmarReserva = async () => {
        const hoy = hoyISO();

        if (!vehiculoSeleccionado) {
            alert('No se seleccionó ningún vehículo.');
            return;
        }

        if (!fechaFin) {
            alert('Seleccione una fecha de finalización.');
            return;
        }

        if (fechaFin < hoy) {
            alert('La fecha de finalización no puede ser menor a la fecha actual.');
            return;
        }

        try {
            setRegistrandoReserva(true);

            await clienteAxios.post('/reservas', {
                id_vehiculo: vehiculoSeleccionado.id,
                fecha_inicio: hoy,
                fecha_fin: fechaFin,
            });

            alert('Reserva registrada correctamente.');

            setModalReserva(false);
            setVehiculoSeleccionado(null);
            setFechaFin('');

            await cargarDatos();
            setSeccion('mis-reservas');
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo registrar la reserva.');
            console.error(error.response?.data || error);
        } finally {
            setRegistrandoReserva(false);
        }
    };

    const cancelarReserva = async (id) => {
        if (!confirm('¿Deseas cancelar esta reserva?')) return;

        try {
            await clienteAxios.delete(`/reservas/${id}`);
            await cargarDatos();
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo cancelar la reserva.');
        }
    };

    const render = () => {
        if (cargando) return <div style={card}>Cargando información...</div>;

        switch (seccion) {
            case 'dashboard-cliente':
                return <DashboardCliente vehiculos={vehiculos} reservas={reservas} alquileres={alquileres} pagos={pagos} irBuscar={() => setSeccion('buscar-vehiculos')} />;
            case 'buscar-vehiculos':
                return <BuscarVehiculos vehiculos={vehiculos} onReservar={reservarVehiculo} />;
            case 'mis-reservas':
                return <MisReservas reservas={reservas} onCancelar={cancelarReserva} />;
            case 'mis-alquileres':
                return <MisAlquileres alquileres={alquileres} />;
            case 'mis-pagos':
                return <MisPagos pagos={pagos} alquileres={alquileres} onPagoCreado={cargarDatos} />;
            case 'mi-perfil':
                return <MiPerfil perfil={perfil} />;
            default:
                return <DashboardCliente vehiculos={vehiculos} reservas={reservas} alquileres={alquileres} pagos={pagos} irBuscar={() => setSeccion('buscar-vehiculos')} />;
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f5f4f0' }}>
            <header style={{
                background: '#111827',
                color: '#fff',
                padding: '0.7rem 1rem',
                display: 'grid',
                gridTemplateColumns: '170px 1fr 280px',
                gap: '1rem',
                alignItems: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,.15)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <strong style={{ fontSize: 22 }}><span style={{ color: '#fff' }}>rent</span><span style={{ color: '#ffb84d' }}>Car</span></strong>
                </div>

                <div style={{ display: 'flex', width: '100%', maxWidth: 720 }}>
                    <select style={{ border: 'none', padding: '0 0.8rem', borderRadius: '8px 0 0 8px' }}><option>Todos</option></select>
                    <input placeholder="Buscar vehículos" style={{ flex: 1, border: 'none', padding: '0.75rem 1rem' }} />
                    <button style={{ border: 'none', padding: '0 1rem', background: '#ffb84d', borderRadius: '0 8px 8px 0', fontWeight: 800 }}>Buscar</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 12 }}>
                        Hola, {perfil?.nombre || auth?.nombre || 'Cliente'}
                    </div>
                    <button onClick={logout} style={{ background: '#111827', color: '#fff', border: '1px solid #fff', padding: '0.6rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Cerrar sesión</button>
                </div>
            </header>

            <nav style={{ background: '#1f2937', color: '#fff', display: 'flex', alignItems: 'center', gap: 18, padding: '0.6rem 1rem', overflowX: 'auto' }}>
                {MENU_CLIENTE.map(m => (
                    <button key={m.id} onClick={() => setSeccion(m.id)} style={{
                        background: seccion === m.id ? '#ffb84d' : 'transparent',
                        color: seccion === m.id ? '#111827' : '#fff',
                        border: seccion === m.id ? '1px solid #ffb84d' : '1px solid transparent',
                        borderRadius: 6,
                        padding: '0.35rem 0.7rem',
                        cursor: 'pointer',
                        fontWeight: 700,
                        whiteSpace: 'nowrap'
                    }}>
                        {m.label}
                    </button>
                ))}
            </nav>

            <main style={{ width: '100%', padding: '1rem', overflowX: 'hidden', boxSizing: 'border-box' }}>
                {render()}
            </main>

            {modalReserva && (
                <ModalReserva
                    vehiculo={vehiculoSeleccionado}
                    fechaFin={fechaFin}
                    setFechaFin={setFechaFin}
                    enviando={registrandoReserva}
                    onCerrar={() => {
                        setModalReserva(false);
                        setVehiculoSeleccionado(null);
                        setFechaFin('');
                    }}
                    onConfirmar={confirmarReserva}
                />
            )}
        </div>
    );
}