import { createContext, useEffect, useState } from 'react';
import clienteAxios from '../config/axios';

const VehiculoContext = createContext();

const FORM_INICIAL = {
    id_categoria: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    placa: '',
    imagen: null,
    color: '',
    tipo_combustible: '',
    transmision: '',
    capacidad_pasajeros: 1,
    kilometraje: 0,
    precio_diario: '',
    estado: 'disponible',
};

const VehiculoProvider = ({ children }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [alerta, setAlerta] = useState({ msg: '', error: false });
    const [form, setForm] = useState(FORM_INICIAL);

    const mostrarAlerta = (msg, error = false) => {
        setAlerta({ msg, error });
        setTimeout(() => setAlerta({ msg: '', error: false }), 3500);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'file'
                ? (files?.[0] || null)
                : type === 'checkbox'
                    ? checked
                    : value,
        }));
    };

    const resetForm = () => {
        setForm({ ...FORM_INICIAL, anio: new Date().getFullYear() });
        setModoEdicion(false);
        setEditandoId(null);
    };

    const construirFormData = () => {
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        });

        return formData;
    };

    const manejarError = (error, mensajeDefault) => {
        const errores = error.response?.data?.errors;

        if (errores) {
            mostrarAlerta(Object.values(errores).flat()[0], true);
            return;
        }

        mostrarAlerta(error.response?.data?.message || mensajeDefault, true);
        console.error(mensajeDefault, error.response?.data || error);
    };

    const fetchCategorias = async () => {
        try {
            const { data } = await clienteAxios.get('/categorias-vehiculos');
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías', error.response?.data || error);
        }
    };

    const fetchVehiculos = async () => {
        setCargando(true);

        try {
            const { data } = await clienteAxios.get('/vehiculos');
            setVehiculos(data);
        } catch (error) {
            manejarError(error, 'Error al cargar los vehículos');
        } finally {
            setCargando(false);
        }
    };

    const crearVehiculo = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const formData = construirFormData();

            const { data } = await clienteAxios.post('/vehiculos', formData);

            setVehiculos((prev) => [data.vehiculo, ...prev]);
            mostrarAlerta(data.mensaje || 'Vehículo registrado correctamente');
            resetForm();
        } catch (error) {
            manejarError(error, 'Error al registrar vehículo');
        } finally {
            setCargando(false);
        }
    };

    const editarVehiculo = (v) => {
        setForm({
            id_categoria: v.id_categoria || '',
            marca: v.marca || '',
            modelo: v.modelo || '',
            anio: v.anio || new Date().getFullYear(),
            placa: v.placa || '',
            imagen: null,
            color: v.color || '',
            tipo_combustible: v.tipo_combustible || '',
            transmision: v.transmision || '',
            capacidad_pasajeros: v.capacidad_pasajeros || 1,
            kilometraje: v.kilometraje || 0,
            precio_diario: v.precio_diario || '',
            estado: v.estado || 'disponible',
        });

        setModoEdicion(true);
        setEditandoId(v.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const actualizarVehiculo = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            const formData = construirFormData();
            formData.append('_method', 'PUT');

            const { data } = await clienteAxios.post(`/vehiculos/${editandoId}`, formData);

            setVehiculos((prev) =>
                prev.map((v) => (v.id === editandoId ? data.vehiculo : v))
            );

            mostrarAlerta(data.mensaje || 'Vehículo actualizado correctamente');
            resetForm();
        } catch (error) {
            manejarError(error, 'Error al actualizar vehículo');
        } finally {
            setCargando(false);
        }
    };

    const eliminarVehiculo = async (id) => {
        if (!confirm('¿Confirma eliminar este vehículo?')) return;

        setCargando(true);

        try {
            const { data } = await clienteAxios.delete(`/vehiculos/${id}`);
            setVehiculos((prev) => prev.filter((v) => v.id !== id));
            mostrarAlerta(data.mensaje || 'Vehículo eliminado correctamente');
        } catch (error) {
            manejarError(error, 'Error al eliminar vehículo');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchVehiculos();
        fetchCategorias();
    }, []);

    return (
        <VehiculoContext.Provider value={{
            vehiculos,
            categorias,
            form,
            alerta,
            cargando,
            modoEdicion,
            handleInputChange,
            crearVehiculo,
            actualizarVehiculo,
            editarVehiculo,
            eliminarVehiculo,
            resetForm,
            fetchVehiculos,
        }}>
            {children}
        </VehiculoContext.Provider>
    );
};

export { VehiculoProvider };
export default VehiculoContext;
