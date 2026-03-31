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
    Schema::create('affectations', function (Blueprint $table) {
        $table->id();
        $table->date('date_affectation');

        $table->foreignId('courrier_id')
              ->constrained()
              ->onDelete('cascade');

        $table->foreignId('service_id')
              ->constrained()
              ->onDelete('cascade');

        $table->timestamps();

        // courrier يتأثر مرة وحدة فقط
        // $table->unique('courrier_id');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
