<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'usuario'  => 'required|string',
            'password' => 'required|string',
        ]);

        $usuario = Usuario::with('persona', 'rol')
            ->where('usuario', $request->usuario)
            ->where('estado', true)
            ->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json(['message' => 'Credenciales incorrectas.'], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'usuario' => [
                'id'      => $usuario->id,
                'usuario' => $usuario->usuario,
                'nombre'  => $usuario->persona->nombres . ' ' . $usuario->persona->apellidos,
                'rol'     => $usuario->rol->nombre,
                'id_rol'  => $usuario->id_rol,
            ],
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
            'usuario' => $usuario->usuario,
            'nombre'  => $usuario->persona->nombres . ' ' . $usuario->persona->apellidos,
            'rol'     => $usuario->rol->nombre,
            'id_rol'  => $usuario->id_rol,
        ]);
    }
}