<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $fillable = ['id_cliente','id_vehiculo','fecha_inicio','fecha_fin','total_estimado','estado'];
    protected $casts = ['fecha_inicio' => 'datetime', 'fecha_fin' => 'datetime'];
 
    public function cliente()  { return $this->belongsTo(Cliente::class,  'id_cliente'); }
    public function vehiculo() { return $this->belongsTo(Vehiculo::class, 'id_vehiculo'); }
    public function alquiler() { return $this->hasOne(Alquiler::class,    'id_reserva'); }

}
