<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\BuildingController;

Route::get('/', [HomeController::class, 'index']);

// Import routes
Route::post('/import/geojson', [ImportController::class, 'importGeoJson'])->name('import.geojson');
Route::get('/buildings', [BuildingController::class, 'index'])->name('api.buildings.index');
