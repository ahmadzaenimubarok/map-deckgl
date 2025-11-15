<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\BuildingController;

// API routes for import functionality
Route::prefix('api')->group(function () {
    Route::post('/import/geojson', [ImportController::class, 'importGeoJson'])->name('api.import.geojson');
    Route::get('/buildings', [BuildingController::class, 'index'])->name('api.buildings.index');
});