<?php

namespace App\Http\Controllers;

use App\Models\Alquiler;
use App\Models\Cliente;
use App\Models\Reserva;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AlquilerController extends Controller
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
        $query = Alquiler::with('cliente.persona', 'vehiculo.categoria', 'usuario.persona', 'reserva', 'pagos')
            ->latest();

        if (!$this->esAdmin($request)) {
            $cliente = $this->clienteActual($request);
            $query->where('id_cliente', $cliente?->id ?? 0);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_reserva' => 'nullable|exists:reservas,id',
            'id_cliente' => 'required_without:id_reserva|exists:clientes,id',
            'id_vehiculo' => 'required_without:id_reserva|exists:vehiculos,id',
            'fecha_salida' => 'required|date',
            'fecha_devolucion_programada' => 'required|date|after:fecha_salida',
        ]);

        $reserva = $request->id_reserva ? Reserva::findOrFail($request->id_reserva) : null;

        $idCliente = $reserva ? $reserva->id_cliente : $request->id_cliente;
        $idVehiculo = $reserva ? $reserva->id_vehiculo : $request->id_vehiculo;

        $vehiculo = Vehiculo::findOrFail($idVehiculo);
        $dias = max(1, Carbon::parse($request->fecha_salida)->diffInDays(Carbon::parse($request->fecha_devolucion_programada)));
        $monto = $dias * (float) $vehiculo->precio_diario;

        $alquiler = Alquiler::create([
            'id_reserva' => $reserva?->id,
            'id_cliente' => $idCliente,
            'id_vehiculo' => $idVehiculo,
            'id_usuario' => $request->user()->id,
            'fecha_salida' => $request->fecha_salida,
            'fecha_devolucion_programada' => $request->fecha_devolucion_programada,
            'monto_total' => $monto,
            'estado' => 'activo',
        ]);

        $vehiculo->update(['estado' => 'alquilado']);

        if ($reserva) {
            $reserva->update(['estado' => 'confirmada']);
        }

        return response()->json([
            'mensaje' => 'Alquiler iniciado correctamente.',
            'alquiler' => $alquiler->load('cliente.persona', 'vehiculo.categoria', 'pagos', 'reserva'),
        ], 201);
    }

    public function show(Alquiler $alquiler)
    {
        return response()->json($alquiler->load('cliente.persona', 'vehiculo.categoria', 'inspecciones', 'pagos', 'usuario.persona'));
    }

    public function finalizar(Request $request, Alquiler $alquiler)
    {
        $request->validate([
            'fecha_devolucion_real' => 'required|date',
            'penalidad' => 'nullable|numeric|min:0',
        ]);

        $alquiler->update([
            'fecha_devolucion_real' => $request->fecha_devolucion_real,
            'penalidad' => $request->penalidad ?? 0,
            'estado' => 'finalizado',
        ]);

        $alquiler->vehiculo->update(['estado' => 'disponible']);

        return response()->json([
            'mensaje' => 'Alquiler finalizado correctamente.',
            'alquiler' => $alquiler->load('cliente.persona', 'vehiculo.categoria', 'pagos'),
        ]);
    }
}
