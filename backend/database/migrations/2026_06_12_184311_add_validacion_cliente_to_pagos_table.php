<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            if (!Schema::hasColumn('pagos', 'nro_operacion')) {
                $table->string('nro_operacion', 80)->nullable()->after('metodo_pago');
            }

            if (!Schema::hasColumn('pagos', 'comprobante')) {
                $table->string('comprobante')->nullable()->after('nro_operacion');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            if (Schema::hasColumn('pagos', 'comprobante')) {
                $table->dropColumn('comprobante');
            }

            if (Schema::hasColumn('pagos', 'nro_operacion')) {
                $table->dropColumn('nro_operacion');
            }
        });
    }
};
