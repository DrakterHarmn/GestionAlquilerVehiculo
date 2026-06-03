import { useContext } from 'react';
import VehiculoContext from '../context/VehiculoContext';

const useVehiculo = () => {
    return useContext(VehiculoContext);
};

export default useVehiculo;