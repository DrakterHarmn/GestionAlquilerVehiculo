<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Reserva;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReservaController extends Controller
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
        $query = Reserva::with('cliente.persona', 'vehiculo.categoria', 'alquiler')
            ->latest();

        if (!$this->esAdmin($request)) {
            $cliente = $this->clienteActual($request);
            $query->where('id_cliente', $cliente?->id ?? 0);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $rules = [
            'id_vehiculo' => 'required|exists:vehiculos,id',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
        ];

        if ($this->esAdmin($request)) {
            $rules['id_cliente'] = 'required|exists:clientes,id';
        }

        $request->validate($rules);

        $cliente = $this->esAdmin($request)
            ? Cliente::findOrFail($request->id_cliente)
            : $this->clienteActual($request);

        if (!$cliente) {
            return response()->json([
                'message' => 'No existe un cliente asociado a este usuario.',
            ], 422);
        }

        $vehiculo = Vehiculo::findOrFail($request->id_vehiculo);

        if ($vehiculo->estado !== 'disponible') {
            return response()->json([
                'message' => 'El vehículo no está disponible para reservar.',
            ], 422);
        }

        $dias = max(1, Carbon::parse($request->fecha_inicio)->diffInDays(Carbon::parse($request->fecha_fin)));
        $total = $dias * (float) $vehiculo->precio_diario;

        $reserva = Reserva::create([
            'id_cliente' => $cliente->id,
            'id_vehiculo' => $vehiculo->id,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'total_estimado' => $total,
            'estado' => 'pendiente',
        ]);

        $vehiculo->update(['estado' => 'reservado']);

        return response()->json([
            'mensaje' => 'Reserva creada correctamente.',
            'reserva' => $reserva->load('cliente.persona', 'vehiculo.categoria'),
        ], 201);
    }

    public function show(Reserva $reserva)
    {
        return response()->json($reserva->load('cliente.persona', 'vehiculo.categoria', 'alquiler'));
    }

    public function update(Request $request, Reserva $reserva)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,confirmada,cancelada,vencida',
        ]);

        $reserva->update(['estado' => $request->estado]);

        if (in_array($request->estado, ['cancelada', 'vencida'], true)) {
            $reserva->vehiculo->update(['estado' => 'disponible']);
        }

        if ($request->estado === 'confirmada') {
            $reserva->vehiculo->update(['estado' => 'reservado']);
        }

        return response()->json([
            'mensaje' => 'Reserva actualizada correctamente.',
            'reserva' => $reserva->load('cliente.persona', 'vehiculo.categoria'),
        ]);
    }

    public function destroy(Reserva $reserva)
    {
        $reserva->vehiculo->update(['estado' => 'disponible']);
        $reserva->update(['estado' => 'cancelada']);

        return response()->json([
            'mensaje' => 'Reserva cancelada correctamente.',
        ]);
    }
}
