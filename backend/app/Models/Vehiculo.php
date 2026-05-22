<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasFactory;

    protected $table = 'vehiculos';
    protected $fillable = [
        'tipo_vehiculo',
        'marca',
        'modelo',
        'anio',
        'placa',
        'precio_alquiler',
        'disponible'        
    ];

    // protected $casts = [
    //     'disponible' => 'boolean',
    // ];

}
