<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialOperacion extends Model
{
    public $timestamps = false;
    protected $table = 'historial_operaciones';
    protected $fillable = [
        'id_usuario','tabla_afectada','id_registro',
        'accion','descripcion','ip_origen','created_at'
    ];
 
    public function usuario() { return $this->belongsTo(Usuario::class, 'id_usuario'); }
}
