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
        Schema::create('alquileres', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('id_reserva')->nullable()->constrained('reservas')->nullOnDelete();
            $table->foreignId('id_cliente')->constrained('clientes');
            $table->foreignId('id_vehiculo')->constrained('vehiculos');
            $table->foreignId('id_usuario')->constrained('usuarios');
            $table->datetime('fecha_salida');
            $table->datetime('fecha_devolucion_programada');
            $table->datetime('fecha_devolucion_real')->nullable();
            $table->decimal('monto_total', 10, 2)->default(0);
            $table->decimal('penalidad', 10, 2)->default(0);
            // activo, finalizado, cancelado
            $table->string('estado', 30)->default('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alquileres');
    }
};
