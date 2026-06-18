<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('vehiculos')) {
            Schema::create('vehiculos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('id_categoria')->constrained('categorias_vehiculos');
                $table->string('placa', 15)->unique();
                $table->string('marca', 100);
                $table->string('modelo', 100);
                $table->string('imagen')->nullable();
                $table->integer('anio');
                $table->string('color', 50)->nullable();
                $table->string('tipo_combustible', 30)->nullable();
                $table->string('transmision', 30)->nullable();
                $table->integer('capacidad_pasajeros')->default(1);
                $table->decimal('kilometraje', 10, 2)->default(0);
                $table->decimal('precio_diario', 10, 2);
                $table->string('estado', 30)->default('disponible');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
