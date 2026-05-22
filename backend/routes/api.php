<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehiculoController;

// GET    /api/vehiculos          → index
// POST   /api/vehiculos          → store
// GET    /api/vehiculos/{id}     → show
// PUT    /api/vehiculos/{id}     → update
// DELETE /api/vehiculos/{id}     → destroy
Route::apiResource('vehiculos', VehiculoController::class);