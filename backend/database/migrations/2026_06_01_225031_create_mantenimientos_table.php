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
        Schema::create('mantenimientos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('id_vehiculo')->constrained('vehiculos');
            $table->foreignId('id_usuario')->constrained('usuarios');
            // preventivo, correctivo
            $table->string('tipo', 30);
            $table->text('descripcion')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->decimal('costo', 10, 2)->default(0);
            // pendiente, en_proceso, finalizado
            $table->string('estado', 30)->default('pendiente');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenimientos');
    }
};
