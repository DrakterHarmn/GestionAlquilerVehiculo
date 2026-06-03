<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    public $timestamps = false;
    protected $table = 'roles';
    protected $fillable = ['nombre','descripcion','estado'];
    protected $casts = ['estado' => 'boolean'];
 
    public function usuarios() { return $this->hasMany(Usuario::class, 'id_rol'); }
}
