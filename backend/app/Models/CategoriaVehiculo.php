<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaVehiculo extends Model
{
    public $timestamps = false;
    protected $table = 'categorias_vehiculos';
    protected $fillable = ['nombre','descripcion','estado'];
    protected $casts = ['estado' => 'boolean'];
 
    public function vehiculos() { return $this->hasMany(Vehiculo::class, 'id_categoria'); }
}
