<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    public $timestamps = false;

    protected $table = 'pagos';

    protected $fillable = [
        'id_alquiler',
        'monto',
        'metodo_pago',
        'nro_operacion',
        'comprobante',
        'fecha_pago',
        'estado',
        'observacion',
    ];

    protected $casts = [
        'fecha_pago' => 'datetime',
    ];

    public function alquiler()
    {
        return $this->belongsTo(Alquiler::class, 'id_alquiler');
    }

    public function movimientosCaja()
    {
        return $this->hasMany(MovimientoCaja::class, 'id_pago');
    }

    public function movimientoCaja()
    {
        return $this->hasOne(MovimientoCaja::class, 'id_pago');
    }

}
