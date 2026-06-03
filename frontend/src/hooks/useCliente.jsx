import { useContext } from 'react';
import ClienteContext from '../context/ClienteContext';

const useCliente = () => useContext(ClienteContext);

export { useCliente };          
export default useCliente;      