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
    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'correo'   => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Buscar usuario por correo en la tabla personas
        $usuario = Usuario::with('persona', 'rol')
            ->whereHas('persona', function ($q) use ($request) {
                $q->where('correo', $request->correo);
            })
            ->where('estado', true)
            ->first();

        // Verificar existencia y contraseña
        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'Correo o contraseña incorrectos.',
            ], 401);
        }

        // Eliminar tokens anteriores (una sesión activa a la vez)
        $usuario->tokens()->delete();

        // Generar token Sanctum
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->persona->nombres . ' ' . $usuario->persona->apellidos,
                'correo' => $usuario->persona->correo,
                'usuario' => $usuario->usuario,
                'id_rol' => $usuario->id_rol,
                'rol' => $usuario->rol->nombre,
                'persona' => $usuario->persona,
            ]
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    // GET /api/me
    public function me(Request $request)
    {
        $usuario = $request->user()->load('persona', 'rol');
        return response()->json([
            'id'      => $usuario->id,
            'nombre'  => $usuario->persona->nombres . ' ' . $usuario->persona->apellidos,
            'correo'  => $usuario->persona->correo,
            'usuario' => $usuario->usuario,
            'rol'     => $usuario->rol->nombre,
            'id_rol'  => $usuario->id_rol,
        ]);
    }

    // POST /api/register-cliente
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
            'licencia_conducir' => 'nullable|string|max:30',
            'fecha_vencimiento_licencia' => 'nullable|date',
        ]);

        $rolCliente = Rol::firstOrCreate(
            ['nombre' => 'cliente'],
            [
                'descripcion' => 'Cliente del sistema',
                'estado' => true
            ]
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

        $cliente = Cliente::create([
            'id_persona' => $persona->id,
            'licencia_conducir' => $request->licencia_conducir,
            'fecha_vencimiento_licencia' => $request->fecha_vencimiento_licencia,
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
            'cliente' => $cliente,
        ], 201);
    }    
}