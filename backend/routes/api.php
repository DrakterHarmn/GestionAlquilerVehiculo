<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\AlquilerController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\InspeccionController;
use App\Http\Controllers\MantenimientoController;
use App\Http\Controllers\CategoriaVehiculoController;

// ══════════════════════════════════════════════════════════════
// RUTAS PÚBLICAS (sin autenticación)
// ══════════════════════════════════════════════════════════════
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-cliente', [AuthController::class, 'registerCliente']);

// ══════════════════════════════════════════════════════════════
// RUTAS PROTEGIDAS (requieren token Sanctum)
// ══════════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Vehículos
    Route::apiResource('vehiculos', VehiculoController::class);

    // Clientes
    Route::apiResource('clientes', ClienteController::class);

    // Reservas
    Route::apiResource('reservas', ReservaController::class);

    // Alquileres
    Route::apiResource('alquileres', AlquilerController::class)->only(['index','store','show']);
    Route::put('/alquileres/{alquiler}/finalizar', [AlquilerController::class, 'finalizar']);

    // Pagos
    Route::get('/pagos',               [PagoController::class, 'index']);
    Route::post('/pagos',              [PagoController::class, 'store']);
    Route::put('/pagos/{pago}/aprobar', [PagoController::class, 'aprobar']);
    Route::put('/pagos/{pago}/rechazar', [PagoController::class, 'rechazar']);
    Route::put('/pagos/{pago}/anular', [PagoController::class, 'anular']);

    // Caja
    Route::get('/caja/estado',             [CajaController::class, 'estado']);
    Route::post('/caja/abrir',             [CajaController::class, 'abrir']);
    Route::put('/caja/{caja}/cerrar',      [CajaController::class, 'cerrar']);
    Route::get('/caja/{caja}/movimientos', [CajaController::class, 'movimientos']);

    // Inspecciones
    Route::post('/inspecciones',                      [InspeccionController::class, 'store']);
    Route::get('/alquileres/{alquiler}/inspecciones', [InspeccionController::class, 'porAlquiler']);

    // Mantenimientos
    Route::get('/mantenimientos',                      [MantenimientoController::class, 'index']);
    Route::post('/mantenimientos',                     [MantenimientoController::class, 'store']);
    Route::put('/mantenimientos/{mantenimiento}',      [MantenimientoController::class, 'update']);

    // Categorías de vehículos
    Route::get('/categorias-vehiculos', [CategoriaVehiculoController::class, 'index']);
    Route::post('/categorias-vehiculos', [CategoriaVehiculoController::class, 'store']);
});
