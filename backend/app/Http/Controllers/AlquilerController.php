<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AlquilerController extends Controller
{
    public function index() {
        return response()->json(
            \App\Models\Alquiler::with('cliente.persona','vehiculo','usuario.persona','reserva')
                ->latest()->get()
        );
    }
 
    public function store(Request $request) {
        $request->validate([
            'id_cliente'                  => 'required|exists:clientes,id',
            'id_vehiculo'                 => 'required|exists:vehiculos,id',
            'id_reserva'                  => 'nullable|exists:reservas,id',
            'fecha_salida'                => 'required|date',
            'fecha_devolucion_programada' => 'required|date|after:fecha_salida',
        ]);
 
        $vehiculo = \App\Models\Vehiculo::findOrFail($request->id_vehiculo);
        $dias = \Carbon\Carbon::parse($request->fecha_salida)->diffInDays($request->fecha_devolucion_programada);
        $monto = $dias * $vehiculo->precio_diario;
 
        $alquiler = \App\Models\Alquiler::create([
            'id_reserva'                  => $request->id_reserva,
            'id_cliente'                  => $request->id_cliente,
            'id_vehiculo'                 => $request->id_vehiculo,
            'id_usuario'                  => $request->user()->id,
            'fecha_salida'                => $request->fecha_salida,
            'fecha_devolucion_programada' => $request->fecha_devolucion_programada,
            'monto_total'                 => $monto,
            'estado'                      => 'activo',
        ]);
 
        $vehiculo->update(['estado' => 'alquilado']);
 
        return response()->json(['mensaje' => 'Alquiler iniciado.', 'alquiler' => $alquiler->load('cliente.persona','vehiculo')], 201);
    }
 
    public function show(\App\Models\Alquiler $alquiler) {
        return response()->json($alquiler->load('cliente.persona','vehiculo','inspecciones','pagos','usuario.persona'));
    }
 
    // Finalizar alquiler (devolución)
    public function finalizar(Request $request, \App\Models\Alquiler $alquiler) {
        $request->validate([
            'fecha_devolucion_real' => 'required|date',
            'penalidad'             => 'nullable|numeric|min:0',
        ]);
 
        $alquiler->update([
            'fecha_devolucion_real' => $request->fecha_devolucion_real,
            'penalidad'             => $request->penalidad ?? 0,
            'estado'                => 'finalizado',
        ]);
 
        $alquiler->vehiculo->update(['estado' => 'disponible']);
 
        return response()->json(['mensaje' => 'Alquiler finalizado.', 'alquiler' => $alquiler]);
    }
}
