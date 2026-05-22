import React from 'react';
import ReactDOM from 'react-dom/client';

import { VehiculoProvider } from './context/VehiculoProvider';
import Vehiculo from './views/Vehiculo';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>

        {/*
            VehiculoProvider envuelve a Vehiculo
            y le da acceso al estado global
        */}

        <VehiculoProvider>

            <Vehiculo />

        </VehiculoProvider>

    </React.StrictMode>

);