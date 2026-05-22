import { useContext } from 'react';
import VehiculoContext from '../context/VehiculoProvider';

const useVehiculo = () => useContext(VehiculoContext);

export default useVehiculo;

// ¿Cómo se usa en cualquier componente?
// const { vehiculos, crearVehiculo, eliminarVehiculo } = useVehiculo();
// Una línea da acceso a TODO el Provider