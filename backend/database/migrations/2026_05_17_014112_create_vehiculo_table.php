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
        Schema::create('vehiculo', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('tipo_vehiculo', 50);
            $table->string('marca', 50);
            $table->string('modelo', 50);
            $table->string('anio');
            $table->string('placa', 20)->unique();
            $table->decimal('precio_alquiler', 10,2);
            $table->boolean('disponible')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculo');
    }
};
