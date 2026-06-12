<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caja extends Model
{
    public $timestamps = false;

    protected $table = 'caja';

    protected $fillable = [
        'id_usuario',
        'fecha_apertura',
        'fecha_cierre',
        'monto_inicial',
        'total_ingresos',
        'total_egresos',
        'monto_final',
        'estado',
    ];

    protected $casts = [
        'fecha_apertura' => 'datetime',
        'fecha_cierre' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class, 'id_caja');
    }
}
