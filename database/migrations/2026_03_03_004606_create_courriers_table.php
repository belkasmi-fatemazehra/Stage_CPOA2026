<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::create('courriers', function (Blueprint $table) {
        $table->id();

        $table->string('numero')->unique();
        $table->string('type');
        $table->string('objet');
        $table->text('description')->nullable();
        $table->date('date_courrier');
        $table->string('expediteur')->nullable();
        $table->string('destinataire')->nullable();
        $table->string('fichier')->nullable();
        //relation
         $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('status_id')
      ->default(1)
      ->constrained('statuses')
      ->cascadeOnUpdate()
      ->restrictOnDelete();

        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('courriers');
    }
};