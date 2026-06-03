<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CajaController extends Controller
{
    public function estado(Request $request) {
        $caja = \App\Models\Caja::where('estado','abierta')
            ->where('id_usuario', $request->user()->id)->first();
        return response()->json($caja ? $caja->load('movimientos') : null);
    }
 
    public function abrir(Request $request) {
        $request->validate(['monto_inicial' => 'required|numeric|min:0']);
 
        $yaAbierta = \App\Models\Caja::where('estado','abierta')->where('id_usuario', $request->user()->id)->exists();
        if ($yaAbierta) return response()->json(['mensaje' => 'Ya tienes una caja abierta.'], 422);
 
        $caja = \App\Models\Caja::create([
            'id_usuario'    => $request->user()->id,
            'fecha_apertura'=> now(),
            'monto_inicial' => $request->monto_inicial,
            'monto_final'   => $request->monto_inicial,
            'estado'        => 'abierta',
        ]);
        return response()->json(['mensaje' => 'Caja abierta.', 'caja' => $caja], 201);
    }
 
    public function cerrar(Request $request, \App\Models\Caja $caja) {
        $caja->update([
            'fecha_cierre' => now(),
            'monto_final'  => $caja->monto_inicial + $caja->total_ingresos - $caja->total_egresos,
            'estado'       => 'cerrada',
        ]);
        return response()->json(['mensaje' => 'Caja cerrada.', 'caja' => $caja]);
    }
 
    public function movimientos(\App\Models\Caja $caja) {
        return response()->json($caja->movimientos()->with('pago')->get());
    }
}