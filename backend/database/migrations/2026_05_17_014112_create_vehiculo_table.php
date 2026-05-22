<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_vehiculo', 50);
            $table->string('marca', 100);
            $table->string('modelo', 100);
            $table->integer('anio');            
            $table->string('placa', 20)->unique();
            $table->decimal('precio_alquiler', 10, 2);
            $table->boolean('disponible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};