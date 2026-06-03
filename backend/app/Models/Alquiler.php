<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alquiler extends Model
{
    protected $table = 'alquileres';
    protected $fillable = [
        'id_reserva','id_cliente','id_vehiculo','id_usuario',
        'fecha_salida','fecha_devolucion_programada','fecha_devolucion_real',
        'monto_total','penalidad','estado'
    ];
    protected $casts = [
        'fecha_salida'                 => 'datetime',
        'fecha_devolucion_programada'  => 'datetime',
        'fecha_devolucion_real'        => 'datetime',
    ];
    public function reserva()      { return $this->belongsTo(Reserva::class,  'id_reserva'); }
    public function cliente()      { return $this->belongsTo(Cliente::class,  'id_cliente'); }
    public function vehiculo()     { return $this->belongsTo(Vehiculo::class, 'id_vehiculo'); }
    public function usuario()      { return $this->belongsTo(Usuario::class,  'id_usuario'); }
    public function inspecciones() { return $this->hasMany(Inspeccion::class, 'id_alquiler'); }
    public function pagos()        { return $this->hasMany(Pago::class,       'id_alquiler'); }
}
