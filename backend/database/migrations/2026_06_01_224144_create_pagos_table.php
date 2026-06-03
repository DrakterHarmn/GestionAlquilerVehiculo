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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_alquiler')->constrained('alquileres');
            $table->decimal('monto', 10, 2);
            // efectivo, yape, plin, transferencia, tarjeta
            $table->string('metodo_pago', 30);
            $table->datetime('fecha_pago');
            // pendiente, pagado, anulado
            $table->string('estado', 30)->default('pendiente');
            $table->text('observacion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
