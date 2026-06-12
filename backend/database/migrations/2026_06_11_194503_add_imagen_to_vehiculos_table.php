<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('vehiculos') && !Schema::hasColumn('vehiculos', 'imagen')) {
            Schema::table('vehiculos', function (Blueprint $table) {
                $table->string('imagen')->nullable()->after('modelo');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('vehiculos') && Schema::hasColumn('vehiculos', 'imagen')) {
            Schema::table('vehiculos', function (Blueprint $table) {
                $table->dropColumn('imagen');
            });
        }
    }
};
