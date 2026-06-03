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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('id_cliente')->constrained('clientes');
            $table->foreignId('id_vehiculo')->constrained('vehiculos');
            $table->datetime('fecha_inicio');
            $table->datetime('fecha_fin');
            $table->decimal('total_estimado', 10, 2);
            // pendiente, confirmada, cancelada, vencida
            $table->string('estado', 30)->default('pendiente');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
