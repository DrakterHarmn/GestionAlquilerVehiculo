<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehiculo;

class VehiculoController extends Controller
{
    // GET /api/vehiculos
    // Listar todos los vehículos
    public function index()
    {
        $vehiculos = Vehiculo::latest()->get();

        return response()->json($vehiculos, 200);
    }

    // POST /api/vehiculos
    // Crear un nuevo vehículo
    public function store(Request $request)
    {
        $request->validate([
            'tipo_vehiculo'   => 'required|in:carro,moto,mototaxi,bicicleta,scooter',
            'marca'           => 'required|string|max:100',
            'modelo'          => 'required|string|max:100',
            'anio'            => 'required|integer|min:1990|max:' . date('Y'),
            'placa'           => 'required|string|max:10|unique:vehiculos,placa',
            'precio_alquiler' => 'required|numeric|min:0.01',
            'disponible'      => 'boolean',
        ]);

        // $vehiculo = Vehiculo::create([
        //     'tipo_vehiculo'   => $request->tipo_vehiculo,
        //     'marca'           => $request->marca,
        //     'modelo'          => $request->modelo,
        //     'anio'            => $request->anio,
        //     'placa'           => strtoupper($request->placa),
        //     'precio_alquiler' => $request->precio_alquiler,
        //     'disponible'      => $request->disponible ?? true,
        // ]);
        $vehiculo = Vehiculo::create($request->all());
        return response()->json($vehiculo, 201);
    }

    // GET /api/vehiculos/{id}
    // Mostrar un vehículo específico
    public function show($id)
    {
        $vehiculo = Vehiculo::findOrFail($id);

        return response()->json($vehiculo, 200);
    }

    // PUT /api/vehiculos/{id}
    // Actualizar vehículo
    public function update(Request $request, $id)
    {
        $vehiculo = Vehiculo::findOrFail($id);

        $request->validate([
            'tipo_vehiculo'   => 'required|in:carro,moto,mototaxi,bicicleta,scooter',
            'marca'           => 'required|string|max:100',
            'modelo'          => 'required|string|max:100',
            'anio'            => 'required|integer|min:1990|max:' . date('Y'),
            'placa'           => 'required|string|max:10|unique:vehiculos,placa,' . $id,
            'precio_alquiler' => 'required|numeric|min:0.01',
            'disponible'      => 'boolean',
        ]);

        $vehiculo->update([
            'tipo_vehiculo'   => $request->tipo_vehiculo,
            'marca'           => $request->marca,
            'modelo'          => $request->modelo,
            'anio'            => $request->anio,
            'placa'           => strtoupper($request->placa),
            'precio_alquiler' => $request->precio_alquiler,
            'disponible'      => $request->has('disponible')
                                    ? $request->disponible
                                    : $vehiculo->disponible,
        ]);

        return response()->json($vehiculo, 200);
    }

    // DELETE /api/vehiculos/{id}
    // Eliminar vehículo
    public function destroy($id)
    {
        $vehiculo = Vehiculo::findOrFail($id);

        $vehiculo->delete();

        return response()->json([
            'msg' => 'Vehículo eliminado correctamente'
        ], 200);
    }
}