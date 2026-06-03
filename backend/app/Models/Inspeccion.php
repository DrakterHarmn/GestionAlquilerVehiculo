<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inspeccion extends Model
{
    public $timestamps = false;
    protected $table = 'inspecciones';
    protected $fillable = [
        'id_alquiler','id_usuario','tipo',
        'kilometraje','nivel_combustible','observaciones','daños','fecha_inspeccion'
    ];
    protected $casts = ['fecha_inspeccion' => 'datetime'];
 
    public function alquiler() { return $this->belongsTo(Alquiler::class, 'id_alquiler'); }
    public function usuario()  { return $this->belongsTo(Usuario::class,  'id_usuario'); }
}
