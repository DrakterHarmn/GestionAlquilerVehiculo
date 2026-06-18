<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Caja;
use App\Models\Mantenimiento;
use App\Models\MovimientoCaja;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class MantenimientoController extends Controller
{
    public function index()
    {
        return response()->json(
            Mantenimiento::with('vehiculo', 'usuario.persona')
                ->latest('fecha_inicio')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_vehiculo'  => 'required|exists:vehiculos,id',
            'tipo'         => 'required|in:preventivo,correctivo',
            'descripcion'  => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin'    => 'nullable|date|after_or_equal:fecha_inicio',
            'costo'        => 'nullable|numeric|min:0',
        ]);

        $mantenimiento = Mantenimiento::create([
            'id_vehiculo'  => $request->id_vehiculo,
            'tipo'         => $request->tipo,
            'descripcion'  => $request->descripcion,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin'    => $request->fecha_fin,
            'costo'        => $request->costo ?? 0,
            'id_usuario'   => $request->user()->id,
            'estado'       => 'pendiente',
        ]);

        Vehiculo::find($request->id_vehiculo)->update([
            'estado' => 'mantenimiento',
        ]);

        $this->registrarEgresoCaja($mantenimiento);

        return response()->json([
            'mensaje' => 'Mantenimiento registrado y egreso enviado a caja.',
            'mantenimiento' => $mantenimiento->load('vehiculo'),
        ], 201);
    }

    public function update(Request $request, Mantenimiento $mantenimiento)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,finalizado',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'costo' => 'nullable|numeric|min:0',
        ]);

        $mantenimiento->update($request->only([
            'estado',
            'fecha_fin',
            'costo',
        ]));

        if ($request->estado === 'finalizado') {
            $mantenimiento->vehiculo->update([
                'estado' => 'disponible',
            ]);
        }

        $this->registrarEgresoCaja($mantenimiento);

        return response()->json([
            'mensaje' => 'Mantenimiento actualizado.',
            'mantenimiento' => $mantenimiento->load('vehiculo'),
        ]);
    }

    private function registrarEgresoCaja(Mantenimiento $mantenimiento): void
    {
        $costo = (float) ($mantenimiento->costo ?? 0);

        if ($costo <= 0) {
            return;
        }

        $yaRegistrado = MovimientoCaja::where('tipo', 'egreso')
            ->where('concepto', 'Mantenimiento #' . $mantenimiento->id)
            ->exists();

        if ($yaRegistrado) {
            return;
        }

        $caja = Caja::where('estado', 'abierta')->latest('id')->first();

        if (!$caja) {
            return;
        }

        MovimientoCaja::create([
            'id_caja' => $caja->id,
            'id_pago' => null,
            'tipo' => 'egreso',
            'concepto' => 'Mantenimiento #' . $mantenimiento->id,
            'monto' => $costo,
            'fecha' => now(),
            'descripcion' => $mantenimiento->descripcion ?: 'Gasto por mantenimiento vehicular',
        ]);

        $this->recalcularCaja($caja);
    }

    private function recalcularCaja(Caja $caja): void
    {
        $ingresos = (float) $caja->movimientos()
            ->where('tipo', 'ingreso')
            ->sum('monto');

        $egresos = (float) $caja->movimientos()
            ->where('tipo', 'egreso')
            ->sum('monto');

        $caja->update([
            'total_ingresos' => $ingresos,
            'total_egresos' => $egresos,
            'monto_final' => (float) $caja->monto_inicial + $ingresos - $egresos,
        ]);
    }
}