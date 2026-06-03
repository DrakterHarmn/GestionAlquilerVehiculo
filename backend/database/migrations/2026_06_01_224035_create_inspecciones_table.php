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
        Schema::create('inspecciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_alquiler')->constrained('alquileres');
            $table->foreignId('id_usuario')->constrained('usuarios');
            // salida, entrada
            $table->string('tipo', 20);
            $table->decimal('kilometraje', 10, 2);
            $table->string('nivel_combustible', 30)->nullable();
            $table->text('observaciones')->nullable();
            $table->text('daños')->nullable();
            $table->datetime('fecha_inspeccion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inspecciones');
    }
};
