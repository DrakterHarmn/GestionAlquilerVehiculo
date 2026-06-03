<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InspeccionController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'id_alquiler'       => 'required|exists:alquileres,id',
            'tipo'              => 'required|in:salida,entrada',
            'kilometraje'       => 'required|numeric|min:0',
            'nivel_combustible' => 'nullable|string|max:30',
            'observaciones'     => 'nullable|string',
            'daños'             => 'nullable|string',
        ]);
 
        $inspeccion = \App\Models\Inspeccion::create([
            ...$request->only(['id_alquiler','tipo','kilometraje','nivel_combustible','observaciones','daños']),
            'id_usuario'       => $request->user()->id,
            'fecha_inspeccion' => now(),
        ]);
 
        // Actualizar kilometraje del vehículo en inspección de entrada
        if ($request->tipo === 'entrada') {
            $alquiler = \App\Models\Alquiler::find($request->id_alquiler);
            $alquiler->vehiculo->update(['kilometraje' => $request->kilometraje]);
        }
 
        return response()->json(['mensaje' => 'Inspección registrada.', 'inspeccion' => $inspeccion], 201);
    }
 
    public function porAlquiler(\App\Models\Alquiler $alquiler) {
        return response()->json($alquiler->inspecciones()->with('usuario.persona')->get());
    }
}