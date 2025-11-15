<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->float('height')->nullable();
            $table->json('properties')->nullable();

            // Geometry column (Polygon / MultiPolygon)
            // Requires PostGIS extension enabled in database
            $table->geometry('geometry', 'GEOMETRY', 4326)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buildings');
    }
};
