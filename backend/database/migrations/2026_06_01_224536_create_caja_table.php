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
        Schema::create('caja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuarios');
            $table->datetime('fecha_apertura');
            $table->datetime('fecha_cierre')->nullable();
            $table->decimal('monto_inicial', 10, 2)->default(0);
            $table->decimal('total_ingresos', 10, 2)->default(0);
            $table->decimal('total_egresos', 10, 2)->default(0);
            $table->decimal('monto_final', 10, 2)->default(0);
            // abierta, cerrada
            $table->string('estado', 20)->default('abierta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caja');
    }
};
