<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('id_categoria')->constrained('categorias_vehiculos');
            $table->string('placa', 15)->unique();
            $table->string('marca', 100);
            $table->string('modelo', 100);
            $table->integer('anio');
            $table->string('color', 50)->nullable();
            $table->string('tipo_combustible', 30)->nullable();
            $table->string('transmision', 30)->nullable();
            $table->integer('capacidad_pasajeros')->default(1);
            $table->decimal('kilometraje', 10, 2)->default(0);
            $table->decimal('precio_diario', 10, 2);
            // disponible, reservado, alquilado, mantenimiento, inactivo
            $table->string('estado', 30)->default('disponible');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
