<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MantenimientoController extends Controller
{
    public function index() {
        return response()->json(\App\Models\Mantenimiento::with('vehiculo','usuario.persona')->latest('fecha_inicio')->get());
    }
 
    public function store(Request $request) {
        $request->validate([
            'id_vehiculo'  => 'required|exists:vehiculos,id',
            'tipo'         => 'required|in:preventivo,correctivo',
            'descripcion'  => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin'    => 'nullable|date|after_or_equal:fecha_inicio',
            'costo'        => 'nullable|numeric|min:0',
        ]);
 
        $mantenimiento = \App\Models\Mantenimiento::create([
            ...$request->only(['id_vehiculo','tipo','descripcion','fecha_inicio','fecha_fin','costo']),
            'id_usuario' => $request->user()->id,
            'estado'     => 'pendiente',
        ]);
 
        // Cambiar estado del vehículo a mantenimiento
        \App\Models\Vehiculo::find($request->id_vehiculo)->update(['estado' => 'mantenimiento']);
 
        return response()->json(['mensaje' => 'Mantenimiento registrado.', 'mantenimiento' => $mantenimiento->load('vehiculo')], 201);
    }
 
    public function update(Request $request, \App\Models\Mantenimiento $mantenimiento) {
        $request->validate(['estado' => 'required|in:pendiente,en_proceso,finalizado']);
        $mantenimiento->update($request->only(['estado','fecha_fin','costo']));
        if ($request->estado === 'finalizado') {
            $mantenimiento->vehiculo->update(['estado' => 'disponible']);
        }
        return response()->json(['mensaje' => 'Mantenimiento actualizado.', 'mantenimiento' => $mantenimiento]);
    }
}
