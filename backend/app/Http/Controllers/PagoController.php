<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    public function index() {
        return response()->json(\App\Models\Pago::with('alquiler.vehiculo','alquiler.cliente.persona')->latest('fecha_pago')->get());
    }
 
    public function store(Request $request) {
        $request->validate([
            'id_alquiler'  => 'required|exists:alquileres,id',
            'monto'        => 'required|numeric|min:0.01',
            'metodo_pago'  => 'required|in:efectivo,yape,plin,transferencia,tarjeta',
            'observacion'  => 'nullable|string',
        ]);
 
        $pago = \App\Models\Pago::create([
            'id_alquiler' => $request->id_alquiler,
            'monto'       => $request->monto,
            'metodo_pago' => $request->metodo_pago,
            'fecha_pago'  => now(),
            'estado'      => 'pagado',
            'observacion' => $request->observacion,
        ]);
 
        // Registrar en caja si hay una caja abierta
        $cajaAbierta = \App\Models\Caja::where('estado', 'abierta')
            ->where('id_usuario', $request->user()->id)->first();
 
        if ($cajaAbierta) {
            \App\Models\MovimientoCaja::create([
                'id_caja'    => $cajaAbierta->id,
                'id_pago'    => $pago->id,
                'tipo'       => 'ingreso',
                'concepto'   => 'Pago alquiler #' . $request->id_alquiler,
                'monto'      => $request->monto,
                'fecha'      => now(),
                'descripcion'=> 'Método: ' . $request->metodo_pago,
            ]);
            $cajaAbierta->increment('total_ingresos', $request->monto);
            $cajaAbierta->update(['monto_final' => $cajaAbierta->monto_inicial + $cajaAbierta->total_ingresos - $cajaAbierta->total_egresos]);
        }
 
        return response()->json(['mensaje' => 'Pago registrado.', 'pago' => $pago], 201);
    }
 
    public function anular(\App\Models\Pago $pago) {
        $pago->update(['estado' => 'anulado']);
        return response()->json(['mensaje' => 'Pago anulado.']);
    }
}
