<?php

namespace App\Http\Controllers;

use App\Models\HistorialOperacion;
use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Storage;

class VehiculoController extends Controller
{
    public function index()
    {
        return response()->json(
            Vehiculo::with('categoria')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $this->asegurarColumnaImagen();

        $request->validate([
            'id_categoria'        => 'required|exists:categorias_vehiculos,id',
            'placa'               => 'required|string|max:15|unique:vehiculos,placa',
            'marca'               => 'required|string|max:100',
            'modelo'              => 'required|string|max:100',
            'anio'                => 'required|integer|min:1990|max:' . date('Y'),
            'imagen'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'color'               => 'nullable|string|max:50',
            'tipo_combustible'    => 'nullable|string|max:30',
            'transmision'         => 'nullable|string|max:30',
            'capacidad_pasajeros' => 'nullable|integer|min:1',
            'kilometraje'         => 'nullable|numeric|min:0',
            'precio_diario'       => 'required|numeric|min:0.01',
            'estado'              => 'nullable|in:disponible,reservado,alquilado,mantenimiento,inactivo',
        ]);

        $imagenPath = null;

        if ($request->hasFile('imagen')) {
            $imagenPath = $request->file('imagen')->store('vehiculos', 'public');
        }

        $vehiculo = Vehiculo::create([
            'id_categoria'        => $request->id_categoria,
            'placa'               => strtoupper($request->placa),
            'marca'               => $request->marca,
            'modelo'              => $request->modelo,
            'imagen'              => $imagenPath,
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
        return response()->json(
            $vehiculo->load('categoria', 'mantenimientos')
        );
    }

    public function update(Request $request, Vehiculo $vehiculo)
    {
        $this->asegurarColumnaImagen();

        $request->validate([
            'id_categoria'        => 'required|exists:categorias_vehiculos,id',
            'placa'               => 'required|string|max:15|unique:vehiculos,placa,' . $vehiculo->id,
            'marca'               => 'required|string|max:100',
            'modelo'              => 'required|string|max:100',
            'anio'                => 'required|integer|min:1990|max:' . date('Y'),
            'imagen'              => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'color'               => 'nullable|string|max:50',
            'tipo_combustible'    => 'nullable|string|max:30',
            'transmision'         => 'nullable|string|max:30',
            'capacidad_pasajeros' => 'nullable|integer|min:1',
            'kilometraje'         => 'nullable|numeric|min:0',
            'precio_diario'       => 'required|numeric|min:0.01',
            'estado'              => 'nullable|in:disponible,reservado,alquilado,mantenimiento,inactivo',
        ]);

        $imagenPath = $vehiculo->imagen;

        if ($request->hasFile('imagen')) {
            if ($vehiculo->imagen) {
                Storage::disk('public')->delete($vehiculo->imagen);
            }

            $imagenPath = $request->file('imagen')->store('vehiculos', 'public');
        }

        $vehiculo->update([
            'id_categoria'        => $request->id_categoria,
            'placa'               => strtoupper($request->placa),
            'marca'               => $request->marca,
            'modelo'              => $request->modelo,
            'imagen'              => $imagenPath,
            'anio'                => $request->anio,
            'color'               => $request->color,
            'tipo_combustible'    => $request->tipo_combustible,
            'transmision'         => $request->transmision,
            'capacidad_pasajeros' => $request->capacidad_pasajeros ?? 1,
            'kilometraje'         => $request->kilometraje ?? 0,
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

        if ($vehiculo->imagen) {
            Storage::disk('public')->delete($vehiculo->imagen);
        }

        $vehiculo->delete();

        $this->historial($request, 'vehiculos', $vehiculo->id, 'ELIMINAR', "Vehículo {$placa} eliminado.");

        return response()->json([
            'mensaje' => 'Vehículo eliminado correctamente.'
        ]);
    }

    private function asegurarColumnaImagen(): void
    {
        if (Schema::hasTable('vehiculos') && !Schema::hasColumn('vehiculos', 'imagen')) {
            Schema::table('vehiculos', function (Blueprint $table) {
                $table->string('imagen')->nullable()->after('modelo');
            });
        }
    }

    private function historial(Request $request, $tabla, $id, $accion, $desc): void
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
                ]);
            }
        } catch (\Exception $e) {
            // El historial no debe impedir registrar, editar o eliminar vehículos.
        }
    }
}
