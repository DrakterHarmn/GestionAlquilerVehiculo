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
        Schema::create('movimientos_caja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_caja')->constrained('caja');
            $table->foreignId('id_pago')->nullable()->constrained('pagos')->nullOnDelete();
            // ingreso, egreso
            $table->string('tipo', 20);
            $table->string('concepto', 100);
            $table->decimal('monto', 10, 2);
            $table->datetime('fecha');
            $table->text('descripcion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_caja');
    }
};
