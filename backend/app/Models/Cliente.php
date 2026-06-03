<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes';
    protected $fillable = ['id_persona','licencia_conducir','fecha_vencimiento_licencia','estado'];
    protected $casts = ['estado' => 'boolean', 'fecha_vencimiento_licencia' => 'date'];
 
    public function persona()   { return $this->belongsTo(Persona::class, 'id_persona'); }
    public function reservas()  { return $this->hasMany(Reserva::class,   'id_cliente'); }
    public function alquileres(){ return $this->hasMany(Alquiler::class,  'id_cliente'); }
}
