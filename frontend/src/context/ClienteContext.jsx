
import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

const ClienteContext = createContext();

const FORM_INICIAL = {
    dni: '', nombres: '', apellidos: '', telefono: '', correo: '',
    direccion: '', licencia_conducir: '', fecha_vencimiento_licencia: '',
};

export const ClienteProvider = ({ children }) => {
    const [clientes,    setClientes]    = useState([]);
    const [form,        setForm]        = useState(FORM_INICIAL);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [editandoId,  setEditandoId]  = useState(null);
    const [alerta,      setAlerta]      = useState({ msg: '', error: false });

    useEffect(() => { fetchClientes(); }, []);

    const mostrarAlerta = (msg, error = false) => {
        setAlerta({ msg, error });
        setTimeout(() => setAlerta({ msg: '', error: false }), 3500);
    };

    const fetchClientes = async () => {
        try {
            const { data } = await clienteAxios.get('/clientes');
            setClientes(data);
        } catch { mostrarAlerta('Error al cargar clientes.', true); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => { setForm(FORM_INICIAL); setModoEdicion(false); setEditandoId(null); };

    const crearCliente = async (e) => {
        e.preventDefault();
        try {
            const { data } = await clienteAxios.post('/clientes', form);
            setClientes(prev => [data.cliente, ...prev]);
            mostrarAlerta(data.mensaje);
            resetForm();
        } catch (err) {
            const errores = err.response?.data?.errors;
            mostrarAlerta(errores ? Object.values(errores).flat()[0] : 'Error al registrar.', true);
        }
    };

    const editarCliente = (c) => {
        setForm({
            dni: c.persona.dni, nombres: c.persona.nombres, apellidos: c.persona.apellidos,
            telefono: c.persona.telefono || '', correo: c.persona.correo || '',
            direccion: c.persona.direccion || '', licencia_conducir: c.licencia_conducir || '',
            fecha_vencimiento_licencia: c.fecha_vencimiento_licencia || '',
        });
        setModoEdicion(true);
        setEditandoId(c.id);
    };

    const actualizarCliente = async (e) => {
        e.preventDefault();
        try {
            const { data } = await clienteAxios.put(`/clientes/${editandoId}`, form);
            setClientes(prev => prev.map(c => c.id === editandoId ? data.cliente : c));
            mostrarAlerta(data.mensaje);
            resetForm();
        } catch (err) {
            const errores = err.response?.data?.errors;
            mostrarAlerta(errores ? Object.values(errores).flat()[0] : 'Error al actualizar.', true);
        }
    };

    const desactivarCliente = async (id) => {
        if (!confirm('¿Desactivar este cliente?')) return;
        try {
            const { data } = await clienteAxios.delete(`/clientes/${id}`);
            setClientes(prev => prev.filter(c => c.id !== id));
            mostrarAlerta(data.mensaje);
        } catch { mostrarAlerta('Error al desactivar.', true); }
    };

    return (
        <ClienteContext.Provider value={{
            clientes, form, modoEdicion, alerta,
            handleInputChange, resetForm, crearCliente,
            editarCliente, actualizarCliente, desactivarCliente,
        }}>
            {children}
        </ClienteContext.Provider>
    );
};

export default ClienteContext;