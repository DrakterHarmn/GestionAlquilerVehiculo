<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos';
    protected $fillable = [
        'id_categoria','placa','marca','modelo','anio','color',
        'tipo_combustible','transmision','capacidad_pasajeros',
        'kilometraje','precio_diario','estado'
    ];
 
    public function categoria()    { return $this->belongsTo(CategoriaVehiculo::class, 'id_categoria'); }
    public function reservas()     { return $this->hasMany(Reserva::class,     'id_vehiculo'); }
    public function alquileres()   { return $this->hasMany(Alquiler::class,    'id_vehiculo'); }
    public function mantenimientos(){ return $this->hasMany(Mantenimiento::class,'id_vehiculo'); }

}
