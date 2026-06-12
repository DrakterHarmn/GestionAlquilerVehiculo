<?php

namespace App\Http\Controllers;

use App\Models\Caja;
use App\Models\MovimientoCaja;
use App\Models\Pago;
use Illuminate\Http\Request;

class CajaController extends Controller
{
    public function estado(Request $request)
    {
        $caja = Caja::where('estado', 'abierta')
            ->where('id_usuario', $request->user()->id)
            ->first();

        if ($caja) {
            $this->sincronizarPagosAprobados($caja);
            $caja->load('movimientos.pago.alquiler.vehiculo');
        }

        return response()->json($caja);
    }

    public function abrir(Request $request)
    {
        $request->validate([
            'monto_inicial' => 'required|numeric|min:0',
        ]);

        $yaAbierta = Caja::where('estado', 'abierta')
            ->where('id_usuario', $request->user()->id)
            ->exists();

        if ($yaAbierta) {
            return response()->json([
                'mensaje' => 'Ya tienes una caja abierta.',
            ], 422);
        }

        $caja = Caja::create([
            'id_usuario' => $request->user()->id,
            'fecha_apertura' => now(),
            'monto_inicial' => $request->monto_inicial,
            'monto_final' => $request->monto_inicial,
            'estado' => 'abierta',
        ]);

        $this->sincronizarPagosAprobados($caja);

        return response()->json([
            'mensaje' => 'Caja abierta correctamente.',
            'caja' => $caja->load('movimientos.pago.alquiler.vehiculo'),
        ], 201);
    }

    public function cerrar(Request $request, Caja $caja)
    {
        $caja->update([
            'fecha_cierre' => now(),
            'monto_final' => $caja->monto_inicial + $caja->total_ingresos - $caja->total_egresos,
            'estado' => 'cerrada',
        ]);

        return response()->json([
            'mensaje' => 'Caja cerrada correctamente.',
            'caja' => $caja->load('movimientos.pago'),
        ]);
    }

    public function movimientos(Caja $caja)
    {
        return response()->json(
            $caja->movimientos()->with('pago')->get()
        );
    }
    private function sincronizarPagosAprobados(Caja $caja): void
    {
        $pagos = Pago::where('estado', 'aprobado')
            ->whereDoesntHave('movimientoCaja')
            ->get();

        foreach ($pagos as $pago) {
            MovimientoCaja::create([
                'id_caja' => $caja->id,
                'id_pago' => $pago->id,
                'tipo' => 'ingreso',
                'concepto' => 'Pago alquiler #' . $pago->id_alquiler,
                'monto' => $pago->monto,
                'fecha' => $pago->fecha_pago ?? now(),
                'descripcion' => 'Método: ' . $pago->metodo_pago,
            ]);
        }

        $ingresos = (float) $caja->movimientos()->where('tipo', 'ingreso')->sum('monto');
        $egresos = (float) $caja->movimientos()->where('tipo', 'egreso')->sum('monto');

        $caja->update([
            'total_ingresos' => $ingresos,
            'total_egresos' => $egresos,
            'monto_final' => (float) $caja->monto_inicial + $ingresos - $egresos,
        ]);
    }

}
