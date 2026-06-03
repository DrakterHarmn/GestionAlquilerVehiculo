<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caja extends Model
{
    public $timestamps = false;
    protected $table = 'movimientos_caja';
    protected $fillable = ['id_caja','id_pago','tipo','concepto','monto','fecha','descripcion'];
    protected $casts = ['fecha' => 'datetime'];
 
    public function caja()  { return $this->belongsTo(Caja::class, 'id_caja'); }
    public function pago()  { return $this->belongsTo(Pago::class, 'id_pago'); }
}
