<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use App\Models\HistorialOperacion;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        return response()->json(Vehiculo::with('categoria')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_categoria'        => 'required|exists:categorias_vehiculos,id',
            'placa'               => 'required|string|max:15|unique:vehiculos,placa',
            'marca'               => 'required|string|max:100',
            'modelo'              => 'required|string|max:100',
            'anio'                => 'required|integer|min:1990|max:' . date('Y'),
            'color'               => 'nullable|string|max:50',
            'tipo_combustible'    => 'nullable|string|max:30',
            'transmision'         => 'nullable|string|max:30',
            'capacidad_pasajeros' => 'nullable|integer|min:1',
            'kilometraje'         => 'nullable|numeric|min:0',
            'precio_diario'       => 'required|numeric|min:0.01',
            'estado'              => 'nullable|in:disponible,reservado,alquilado,mantenimiento,inactivo',
        ]);

        $vehiculo = Vehiculo::create([
            'id_categoria'        => $request->id_categoria,
            'placa'               => strtoupper($request->placa),
            'marca'               => $request->marca,
            'modelo'              => $request->modelo,
            'anio'                => $request->anio,
            'color'               => $request->color,
            'tipo_combustible'    => $request->tipo_combustible,
            'transmision'         => $request->transmision,
            'capacidad_pasajeros' => $request->capacidad_pasajeros ?? 1,
            'kilometraje'         => $request->kilometraje ?? 0,
            'precio_diario'       => $request->precio_diario,
            'estado'              => $request->estado ?? 'disponible',
        ]);

        $this->historial($request, 'vehiculos', $vehiculo->id, 'CREAR', "Vehículo {$vehiculo->placa} registrado.");

        return response()->json([
            'mensaje'  => 'Vehículo registrado correctamente.',
            'vehiculo' => $vehiculo->load('categoria'),
        ], 201);
    }

    public function show(Vehiculo $vehiculo)
    {
        return response()->json($vehiculo->load('categoria', 'mantenimientos'));
    }

    public function update(Request $request, Vehiculo $vehiculo)
    {
        $request->validate([
            'id_categoria'        => 'required|exists:categorias_vehiculos,id',
            'placa'               => 'required|string|max:15|unique:vehiculos,placa,' . $vehiculo->id,
            'marca'               => 'required|string|max:100',
            'modelo'              => 'required|string|max:100',
            'anio'                => 'required|integer|min:1990|max:' . date('Y'),
            'color'               => 'nullable|string|max:50',
            'tipo_combustible'    => 'nullable|string|max:30',
            'transmision'         => 'nullable|string|max:30',
            'capacidad_pasajeros' => 'nullable|integer|min:1',
            'kilometraje'         => 'nullable|numeric|min:0',
            'precio_diario'       => 'required|numeric|min:0.01',
            'estado'              => 'nullable|in:disponible,reservado,alquilado,mantenimiento,inactivo',
        ]);

        $vehiculo->update([
            'id_categoria'        => $request->id_categoria,
            'placa'               => strtoupper($request->placa),
            'marca'               => $request->marca,
            'modelo'              => $request->modelo,
            'anio'                => $request->anio,
            'color'               => $request->color,
            'tipo_combustible'    => $request->tipo_combustible,
            'transmision'         => $request->transmision,
            'capacidad_pasajeros' => $request->capacidad_pasajeros,
            'kilometraje'         => $request->kilometraje,
            'precio_diario'       => $request->precio_diario,
            'estado'              => $request->estado ?? $vehiculo->estado,
        ]);

        $this->historial($request, 'vehiculos', $vehiculo->id, 'ACTUALIZAR', "Vehículo {$vehiculo->placa} actualizado.");

        return response()->json([
            'mensaje'  => 'Vehículo actualizado correctamente.',
            'vehiculo' => $vehiculo->load('categoria'),
        ]);
    }

    public function destroy(Request $request, Vehiculo $vehiculo)
    {
        $placa = $vehiculo->placa;
        $vehiculo->delete();
        $this->historial($request, 'vehiculos', $vehiculo->id, 'ELIMINAR', "Vehículo {$placa} eliminado.");
        return response()->json(['mensaje' => 'Vehículo eliminado correctamente.']);
    }

    private function historial(Request $request, $tabla, $id, $accion, $desc)
    {
        try {
            if ($request->user()) {
                HistorialOperacion::create([
                    'id_usuario'     => $request->user()->id,
                    'tabla_afectada' => $tabla,
                    'id_registro'    => $id,
                    'accion'         => $accion,
                    'descripcion'    => $desc,
                    'ip_origen'      => $request->ip(),
                    'created_at'     => now(),
                ]);
            }
        } catch (\Exception $e) {}
    }
}