<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('affectations', function (Blueprint $table) {
            // 1️⃣ نحيد FK مؤقت
            $table->dropForeign(['courrier_id']);

            // 2️⃣ نحيد unique index
            $table->dropUnique('affectations_courrier_id_unique');

            // 3️⃣ نرجعو FK
            $table->foreign('courrier_id')
                  ->references('id')
                  ->on('courriers')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('affectations', function (Blueprint $table) {
            // نحيد FK مؤقت
            $table->dropForeign(['courrier_id']);

            // نرجعو unique
            $table->unique('courrier_id');

            // نرجعو FK
            $table->foreign('courrier_id')
                  ->references('id')
                  ->on('courriers')
                  ->onDelete('cascade');
        });
    }
};