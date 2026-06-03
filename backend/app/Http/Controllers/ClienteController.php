<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Persona;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return response()->json(Cliente::with('persona')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'dni'                        => 'required|string|max:15|unique:personas,dni',
            'nombres'                    => 'required|string|max:100',
            'apellidos'                  => 'required|string|max:100',
            'telefono'                   => 'nullable|string|max:20',
            'correo'                     => 'nullable|email|max:100',
            'direccion'                  => 'nullable|string|max:150',
            'licencia_conducir'          => 'nullable|string|max:30',
            'fecha_vencimiento_licencia' => 'nullable|date',
        ]);

        $persona = Persona::create($request->only(['dni','nombres','apellidos','telefono','correo','direccion']));

        $cliente = Cliente::create([
            'id_persona'                 => $persona->id,
            'licencia_conducir'          => $request->licencia_conducir,
            'fecha_vencimiento_licencia' => $request->fecha_vencimiento_licencia,
        ]);

        return response()->json(['mensaje' => 'Cliente registrado.', 'cliente' => $cliente->load('persona')], 201);
    }

    public function show(Cliente $cliente)
    {
        return response()->json($cliente->load('persona', 'alquileres', 'reservas'));
    }

    public function update(Request $request, Cliente $cliente)
    {
        $request->validate([
            'nombres'                    => 'required|string|max:100',
            'apellidos'                  => 'required|string|max:100',
            'telefono'                   => 'nullable|string|max:20',
            'correo'                     => 'nullable|email|max:100',
            'direccion'                  => 'nullable|string|max:150',
            'licencia_conducir'          => 'nullable|string|max:30',
            'fecha_vencimiento_licencia' => 'nullable|date',
        ]);

        $cliente->persona->update($request->only(['nombres','apellidos','telefono','correo','direccion']));
        $cliente->update($request->only(['licencia_conducir','fecha_vencimiento_licencia']));

        return response()->json(['mensaje' => 'Cliente actualizado.', 'cliente' => $cliente->load('persona')]);
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->persona->update(['estado' => false]);
        $cliente->update(['estado' => false]);
        return response()->json(['mensaje' => 'Cliente desactivado.']);
    }
}