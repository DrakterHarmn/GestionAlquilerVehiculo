<?php

namespace App\Http\Controllers;

use App\Models\CategoriaVehiculo;
use Illuminate\Http\Request;

class CategoriaVehiculoController extends Controller
{
    // GET /api/categorias-vehiculos
    public function index()
    {
        return response()->json(
            CategoriaVehiculo::where('estado', true)->orderBy('nombre')->get()
        );
    }

    // POST /api/categorias-vehiculos
    public function store(Request $request)
    {
        $request->validate([
            'nombre'      => 'required|string|max:100',
            'descripcion' => 'nullable|string',
        ]);
        $categoria = CategoriaVehiculo::create([
            'nombre'      => $request->nombre,
            'descripcion' => $request->descripcion,
            'estado'      => true,
        ]);
        return response()->json(['mensaje' => 'Categoría creada.', 'categoria' => $categoria], 201);
    }
}