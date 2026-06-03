<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;  // ← esta línea

class Usuario extends Authenticatable
{
    use HasApiTokens;  // ← y este trait

    protected $table = 'usuarios';
    protected $fillable = ['id_persona', 'id_rol', 'usuario', 'password', 'estado'];
    protected $hidden   = ['password'];
    protected $casts    = ['estado' => 'boolean', 'password' => 'hashed'];

    public function persona() { return $this->belongsTo(Persona::class, 'id_persona'); }
    public function rol()     { return $this->belongsTo(Rol::class, 'id_rol'); }
}