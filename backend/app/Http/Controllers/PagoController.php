<?php

namespace App\Http\Controllers;

use App\Models\Alquiler;
use App\Models\Caja;
use App\Models\Cliente;
use App\Models\MovimientoCaja;
use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller
{
    private function esAdmin(Request $request): bool
    {
        return $request->user()?->rol?->nombre === 'admin' || (int) $request->user()?->id_rol === 1;
    }

    private function clienteActual(Request $request): ?Cliente
    {
        return Cliente::where('id_persona', $request->user()->id_persona)->first();
    }

    public function index(Request $request)
    {
        $query = Pago::with('alquiler.vehiculo.categoria', 'alquiler.cliente.persona')
            ->latest('fecha_pago');

        if (!$this->esAdmin($request)) {
            $cliente = $this->clienteActual($request);
            $query->whereHas('alquiler', function ($q) use ($cliente) {
                $q->where('id_cliente', $cliente?->id ?? 0);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_alquiler'    => 'required|exists:alquileres,id',
            'metodo_pago'    => 'required|in:efectivo,yape,plin,transferencia,tarjeta',
            'nro_operacion'  => 'nullable|string|max:80',
        ]);

        $alquiler = Alquiler::with('cliente.persona', 'vehiculo')->findOrFail($request->id_alquiler);

        if (!$this->esAdmin($request)) {
            $cliente = $this->clienteActual($request);

            if (!$cliente || (int) $alquiler->id_cliente !== (int) $cliente->id) {
                return response()->json([
                    'message' => 'No puedes registrar pagos para un alquiler que no te pertenece.',
                ], 403);
            }
        }

        // El monto se obtiene siempre desde el alquiler para evitar pagos manipulados desde el frontend.
        $montoAutomatico = (float) $alquiler->monto_total + (float) ($alquiler->penalidad ?? 0);
        if ($montoAutomatico <= 0) {
            return response()->json(['message' => 'El alquiler seleccionado no tiene un monto válido para pagar.'], 422);
        }

        $estado = $this->esAdmin($request) ? 'aprobado' : 'pendiente';

        $pago = Pago::create([
            'id_alquiler'   => $alquiler->id,
            'monto'         => $montoAutomatico,
            'metodo_pago'   => $request->metodo_pago,
            'nro_operacion' => $request->nro_operacion,
            'comprobante'   => null,
            'fecha_pago'    => now(),
            'estado'        => $estado,
            'observacion'   => null,
        ]);

        if ($estado === 'aprobado') {
            $this->registrarIngresoCaja($request, $pago);
        }

        return response()->json([
            'mensaje' => $estado === 'pendiente'
                ? 'Pago enviado correctamente. Quedará pendiente de validación por el administrador.'
                : 'Pago registrado y aprobado correctamente.',
            'pago' => $pago->load('alquiler.vehiculo.categoria', 'alquiler.cliente.persona'),
        ], 201);
    }

    public function aprobar(Request $request, Pago $pago)
    {
        if (!$this->esAdmin($request)) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        if ($pago->estado === 'anulado') {
            return response()->json(['message' => 'No se puede aprobar un pago anulado.'], 422);
        }

        $pago->update([
            'estado' => 'aprobado',
            'observacion' => $request->observacion ?? $pago->observacion,
        ]);

        $this->registrarIngresoCaja($request, $pago);

        return response()->json([
            'mensaje' => 'Pago aprobado correctamente.',
            'pago' => $pago->load('alquiler.vehiculo.categoria', 'alquiler.cliente.persona'),
        ]);
    }

    public function rechazar(Request $request, Pago $pago)
    {
        if (!$this->esAdmin($request)) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $request->validate([
            'observacion' => 'nullable|string|max:500',
        ]);

        $pago->update([
            'estado' => 'rechazado',
            'observacion' => $request->observacion ?? $pago->observacion,
        ]);

        return response()->json([
            'mensaje' => 'Pago rechazado correctamente.',
            'pago' => $pago->load('alquiler.vehiculo.categoria', 'alquiler.cliente.persona'),
        ]);
    }

    public function anular(Request $request, Pago $pago)
    {
        if (!$this->esAdmin($request)) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $movimiento = MovimientoCaja::where('id_pago', $pago->id)->first();
        $caja = $movimiento?->caja;

        if ($movimiento) {
            $movimiento->delete();
        }

        $pago->update(['estado' => 'anulado']);

        if ($caja) {
            $this->recalcularCaja($caja);
        }

        return response()->json([
            'mensaje' => 'Pago anulado correctamente.',
        ]);
    }

    private function registrarIngresoCaja(Request $request, Pago $pago): void
    {
        $yaRegistrado = MovimientoCaja::where('id_pago', $pago->id)->exists();

        if ($yaRegistrado) {
            return;
        }

        $cajaAbierta = Caja::where('estado', 'abierta')->latest('id')->first();

        if (!$cajaAbierta) {
            return;
        }

        MovimientoCaja::create([
            'id_caja' => $cajaAbierta->id,
            'id_pago' => $pago->id,
            'tipo' => 'ingreso',
            'concepto' => 'Pago alquiler #' . $pago->id_alquiler,
            'monto' => $pago->monto,
            'fecha' => now(),
            'descripcion' => 'Método: ' . $pago->metodo_pago,
        ]);

        $this->recalcularCaja($cajaAbierta);

        $cajaAbierta->update([
            'monto_final' => $cajaAbierta->monto_inicial + $cajaAbierta->total_ingresos - $cajaAbierta->total_egresos,
        ]);
    }


    private function recalcularCaja(Caja $caja): void
    {
        $ingresos = (float) $caja->movimientos()->where('tipo', 'ingreso')->sum('monto');
        $egresos = (float) $caja->movimientos()->where('tipo', 'egreso')->sum('monto');

        $caja->update([
            'total_ingresos' => $ingresos,
            'total_egresos' => $egresos,
            'monto_final' => (float) $caja->monto_inicial + $ingresos - $egresos,
        ]);
    }

}

