<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Building;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImportController extends Controller
{
    public function importGeoJson(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'geojson_file' => 'required|file|mimes:json,geojson',
                'overwrite' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('geojson_file');
            $overwrite = $request->input('overwrite', false);

            // Read and parse GeoJSON file
            $geojsonContent = file_get_contents($file->getPathname());
            $geojsonData = json_decode($geojsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JSON format'
                ], 400);
            }

            // Validate GeoJSON structure
            if (!isset($geojsonData['type']) || !isset($geojsonData['features'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid GeoJSON format. Must contain type and features'
                ], 400);
            }

            // Start transaction
            DB::beginTransaction();

            // Clear existing data if overwrite is true
            if ($overwrite) {
                Building::truncate();
            }

            $importedCount = 0;
            $skippedCount = 0;
            $errors = [];

            foreach ($geojsonData['features'] as $index => $feature) {
                try {
                    // Skip if feature doesn't have geometry
                    if (!isset($feature['geometry'])) {
                        $skippedCount++;
                        $errors[] = "Feature {$index}: Missing geometry";
                        continue;
                    }

                    // Extract properties
                    $properties = $feature['properties'] ?? null;
                    $name = $properties['name'] ?? null;
                    $height = $properties['height'] ?? null;

                    // Create building record
                    $building = Building::create([
                        'name' => $name,
                        'height' => $height,
                        'properties' => $properties,
                    ]);

                    $geometry = json_encode($feature['geometry']);

                    DB::update(
                        "UPDATE buildings 
                        SET geometry = ST_GeomFromGeoJSON(?)
                        WHERE id = ?",
                        [
                            $geometry,
                            $building->id
                        ]
                    );

                    $importedCount++;

                } catch (\Exception $e) {
                    $skippedCount++;
                    $errors[] = "Feature {$index}: " . $e->getMessage();
                    Log::error("GeoJSON import error for feature {$index}: " . $e->getMessage());
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'GeoJSON import completed',
                'imported_count' => $importedCount,
                'skipped_count' => $skippedCount,
                'errors' => $errors,
                'overwrite' => $overwrite
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GeoJSON import failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }
}