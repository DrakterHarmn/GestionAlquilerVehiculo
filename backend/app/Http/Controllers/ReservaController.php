<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index() {
        return response()->json(
            \App\Models\Reserva::with('cliente.persona','vehiculo')->latest()->get()
        );
    }
 
    public function store(Request $request) {
        $request->validate([
            'id_cliente'      => 'required|exists:clientes,id',
            'id_vehiculo'     => 'required|exists:vehiculos,id',
            'fecha_inicio'    => 'required|date|after_or_equal:today',
            'fecha_fin'       => 'required|date|after:fecha_inicio',
            'total_estimado'  => 'required|numeric|min:0',
        ]);
 
        // Calcular total_estimado automáticamente
        $vehiculo = \App\Models\Vehiculo::findOrFail($request->id_vehiculo);
        $dias = \Carbon\Carbon::parse($request->fecha_inicio)->diffInDays($request->fecha_fin);
        $total = $dias * $vehiculo->precio_diario;
 
        $reserva = \App\Models\Reserva::create([
            'id_cliente'     => $request->id_cliente,
            'id_vehiculo'    => $request->id_vehiculo,
            'fecha_inicio'   => $request->fecha_inicio,
            'fecha_fin'      => $request->fecha_fin,
            'total_estimado' => $total,
            'estado'         => 'pendiente',
        ]);
 
        // Cambiar estado del vehículo a reservado
        $vehiculo->update(['estado' => 'reservado']);
 
        return response()->json(['mensaje' => 'Reserva creada.', 'reserva' => $reserva->load('cliente.persona','vehiculo')], 201);
    }
 
    public function show(\App\Models\Reserva $reserva) {
        return response()->json($reserva->load('cliente.persona','vehiculo','alquiler'));
    }
 
    public function update(Request $request, \App\Models\Reserva $reserva) {
        $request->validate(['estado' => 'required|in:pendiente,confirmada,cancelada,vencida']);
        $reserva->update(['estado' => $request->estado]);
        if ($request->estado === 'cancelada') {
            $reserva->vehiculo->update(['estado' => 'disponible']);
        }
        return response()->json(['mensaje' => 'Reserva actualizada.', 'reserva' => $reserva]);
    }
 
    public function destroy(\App\Models\Reserva $reserva) {
        $reserva->vehiculo->update(['estado' => 'disponible']);
        $reserva->update(['estado' => 'cancelada']);
        return response()->json(['mensaje' => 'Reserva cancelada.']);
    }
}