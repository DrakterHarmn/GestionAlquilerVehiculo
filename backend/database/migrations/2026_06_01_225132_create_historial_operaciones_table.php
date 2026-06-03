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
        Schema::create('historial_operaciones', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('id_usuario')->constrained('usuarios');
            $table->string('tabla_afectada', 100);
            $table->integer('id_registro');
            $table->string('accion', 100);
            $table->text('descripcion')->nullable();
            $table->string('ip_origen', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_operaciones');
    }
};
