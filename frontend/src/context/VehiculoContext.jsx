import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

// Crear contexto
const VehiculoContext = createContext();

const VehiculoProvider = ({ children }) => {

    // =========================
    // ESTADOS
    // =========================

    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const [alerta, setAlerta] = useState({
        msg: '',
        error: false
    });

    const [modoEdicion, setModoEdicion] = useState(false);

    const [editandoId, setEditandoId] = useState(null);

    // Estado del formulario — 7 campos del vehículo
    const [form, setForm] = useState({
        tipo_vehiculo:   'carro',
        marca:           '',
        modelo:          '',
        anio:            new Date().getFullYear(),
        placa:           '',
        precio_alquiler: '',
        disponible:      true,
    });

    // =========================
    // MANEJAR INPUTS
    // =========================

    const handleInputChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            // Checkbox usa 'checked', el resto usa 'value'
            [name]: type === 'checkbox' ? checked : value,
        });

    };

    // =========================
    // RESETEAR FORMULARIO
    // =========================

    const resetForm = () => {

        setForm({
            tipo_vehiculo:   'carro',
            marca:           '',
            modelo:          '',
            anio:            new Date().getFullYear(),
            placa:           '',
            precio_alquiler: '',
            disponible:      true,
        });

        setModoEdicion(false);
        setEditandoId(null);

    };

    // =========================
    // ALERTAS
    // =========================

    const mostrarAlerta = (msg, error = false) => {

        setAlerta({ msg, error });

        setTimeout(() => {
            setAlerta({ msg: '', error: false });
        }, 3500);

    };

    // =========================
    // GET - LISTAR VEHÍCULOS
    // =========================

    const fetchVehiculos = async () => {

        setCargando(true);

        try {

            const { data } = await clienteAxios.get('/api/vehiculos');

            setVehiculos(data);

        } catch (error) {

            mostrarAlerta('Error al cargar los vehículos', true);

        } finally {

            setCargando(false);

        }

    };

    // =========================
    // POST - CREAR VEHÍCULO
    // =========================

    const crearVehiculo = async (e) => {

        e.preventDefault();

        setCargando(true);

        try {

            const { data } = await clienteAxios.post('/api/vehiculos', form);

            setVehiculos([...vehiculos, data]);

            mostrarAlerta('Vehículo registrado correctamente');

            resetForm();

        } catch (error) {

            const errores = error.response?.data?.errors;

            if (errores) {
                // Toma el primer error de validación
                const primerError = Object.values(errores).flat()[0];
                mostrarAlerta(primerError, true);
            } else {
                mostrarAlerta(
                    error.response?.data?.message || 'Error al registrar',
                    true
                );
            }

        } finally {

            setCargando(false);

        }

    };

    // =========================
    // CARGAR DATOS PARA EDITAR
    // =========================

    const editarVehiculo = (vehiculo) => {

        setForm({
            tipo_vehiculo:   vehiculo.tipo_vehiculo,
            marca:           vehiculo.marca,
            modelo:          vehiculo.modelo,
            anio:            vehiculo.anio,
            placa:           vehiculo.placa,
            precio_alquiler: vehiculo.precio_alquiler,
            disponible:      vehiculo.disponible,
        });

        setModoEdicion(true);
        setEditandoId(vehiculo.id);

    };

    // =========================
    // PUT - ACTUALIZAR VEHÍCULO
    // =========================

    const actualizarVehiculo = async (e) => {

        e.preventDefault();

        setCargando(true);

        try {

            const { data } = await clienteAxios.put(`/api/vehiculos/${editandoId}`,
                form
            );

            setVehiculos(
                vehiculos.map((v) =>
                    v.id === editandoId ? data : v
                )
            );

            mostrarAlerta('Vehículo actualizado correctamente');

            resetForm();

        } catch (error) {

            const errores = error.response?.data?.errors;

            if (errores) {
                const primerError = Object.values(errores).flat()[0];
                mostrarAlerta(primerError, true);
            } else {
                mostrarAlerta('Error al actualizar', true);
            }

        } finally {

            setCargando(false);

        }

    };

    // =========================
    // DELETE - ELIMINAR VEHÍCULO
    // =========================

    const eliminarVehiculo = async (id) => {

        if (!confirm('¿Confirma eliminar este vehículo?')) return;

        setCargando(true);

        try {

            await clienteAxios.delete(`/api/vehiculos/${id}`);

            setVehiculos(vehiculos.filter((v) => v.id !== id));

            mostrarAlerta('Vehículo eliminado correctamente');

        } catch (error) {

            mostrarAlerta('Error al eliminar', true);

        } finally {

            setCargando(false);

        }

    };

    // =========================
    // CARGAR AL INICIAR
    // =========================

    useEffect(() => {
        fetchVehiculos();
    }, []);

    // =========================
    // PROVIDER
    // =========================

    return (

        <VehiculoContext.Provider
            value={{
                vehiculos,
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
            }}
        >

            {children}

        </VehiculoContext.Provider>

    );

};

export { VehiculoProvider };

export default VehiculoContext;