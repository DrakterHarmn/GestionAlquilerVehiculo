<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    
    protected $table = 'personas';
    protected $fillable = [
        'dni',
        'nombres',
        'apellidos',
        'telefono',
        'correo',
        'direccion',
        'estado'
    ];
    protected $casts = [
        'estado' => 'boolean',
    ];
    public function usuario()
    {
        return $this->hasOne(Usuario::class, 'id_persona');
    }

    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'id_persona');
    }
    
};