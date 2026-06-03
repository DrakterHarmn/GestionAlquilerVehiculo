<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    public $timestamps = false;
    protected $table = 'mantenimientos';
    protected $fillable = [
        'id_vehiculo','id_usuario','tipo',
        'descripcion','fecha_inicio','fecha_fin','costo','estado'
    ];
    protected $casts = ['fecha_inicio' => 'date', 'fecha_fin' => 'date'];
 
    public function vehiculo() { return $this->belongsTo(Vehiculo::class, 'id_vehiculo'); }
    public function usuario()  { return $this->belongsTo(Usuario::class,  'id_usuario'); }
}
