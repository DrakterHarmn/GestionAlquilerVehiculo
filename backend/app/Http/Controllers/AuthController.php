<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Persona;
use App\Models\Rol;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'correo'   => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $usuario = Usuario::with('persona', 'rol')
            ->whereHas('persona', function ($q) use ($request) {
                $q->where('correo', $request->correo);
            })
            ->where('estado', true)
            ->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'Correo o contraseña incorrectos.',
            ], 401);
        }

        $usuario->tokens()->delete();
        $token = $usuario->createToken('auth_token')->plainTextToken;
        $cliente = Cliente::with('persona')->where('id_persona', $usuario->id_persona)->first();

        return response()->json([
            'token' => $token,
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => trim(($usuario->persona->nombres ?? '') . ' ' . ($usuario->persona->apellidos ?? '')),
                'correo' => $usuario->persona->correo,
                'usuario' => $usuario->usuario,
                'id_rol' => $usuario->id_rol,
                'rol' => $usuario->rol->nombre,
                'persona' => $usuario->persona,
                'cliente' => $cliente,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    public function me(Request $request)
    {
        $usuario = $request->user()->load('persona', 'rol');
        $cliente = Cliente::with('persona')->where('id_persona', $usuario->id_persona)->first();

        return response()->json([
            'id' => $usuario->id,
            'nombre' => trim(($usuario->persona->nombres ?? '') . ' ' . ($usuario->persona->apellidos ?? '')),
            'correo' => $usuario->persona->correo,
            'usuario' => $usuario->usuario,
            'rol' => $usuario->rol->nombre,
            'id_rol' => $usuario->id_rol,
            'persona' => $usuario->persona,
            'cliente' => $cliente,
        ]);
    }

    public function registerCliente(Request $request)
    {
        $request->validate([
            'dni' => 'required|string|max:15|unique:personas,dni',
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'correo' => 'required|email|max:100|unique:personas,correo',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:150',
            'usuario' => 'required|string|max:50|unique:usuarios,usuario',
            'password' => 'required|string|min:6',
            'tiene_licencia' => 'nullable|in:si,no',
            'licencia_conducir' => 'required_if:tiene_licencia,si|nullable|string|max:30',
            'fecha_vencimiento_licencia' => 'required_if:tiene_licencia,si|nullable|date',
        ]);

        $rolCliente = Rol::firstOrCreate(
            ['nombre' => 'cliente'],
            ['descripcion' => 'Cliente del sistema', 'estado' => true]
        );

        $persona = Persona::create([
            'dni' => $request->dni,
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'direccion' => $request->direccion,
            'estado' => true,
        ]);

        $usuario = Usuario::create([
            'id_persona' => $persona->id,
            'id_rol' => $rolCliente->id,
            'usuario' => $request->usuario,
            'password' => Hash::make($request->password),
            'estado' => true,
        ]);

        $tieneLicencia = $request->tiene_licencia === 'si';

        $cliente = Cliente::create([
            'id_persona' => $persona->id,
            'licencia_conducir' => $tieneLicencia ? $request->licencia_conducir : null,
            'fecha_vencimiento_licencia' => $tieneLicencia ? $request->fecha_vencimiento_licencia : null,
            'estado' => true,
        ]);

        return response()->json([
            'message' => 'Cliente registrado correctamente.',
            'usuario' => [
                'id' => $usuario->id,
                'usuario' => $usuario->usuario,
                'rol' => $rolCliente->nombre,
                'id_rol' => $rolCliente->id,
            ],
            'cliente' => $cliente->load('persona'),
        ], 201);
    }
}
