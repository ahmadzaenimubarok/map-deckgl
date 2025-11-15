<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuildingController extends Controller
{
    /**
     * Get all buildings with their coordinates for scatterplot
     */
    public function index()
    {
        try {
            $buildings = Building::select('id', 'name', 'height', 'properties')
                ->whereNotNull('geometry')
                ->get()
                ->map(function ($building) {
                    // Get centroid coordinates from geometry
                    $centroid = DB::selectOne("
                        SELECT 
                            ST_X(ST_Centroid(geometry)) as longitude,
                            ST_Y(ST_Centroid(geometry)) as latitude
                        FROM buildings 
                        WHERE id = ?
                    ", [$building->id]);

                    return [
                        'id' => $building->id,
                        'name' => $building->name,
                        'height' => $building->height,
                        'position' => [
                            $centroid->longitude ?? 0,
                            $centroid->latitude ?? 0
                        ],
                        'properties' => $building->properties
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $buildings
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch buildings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all buildings as GeoJSON for polygon layer
     */
    public function geojson()
    {
        try {
            $buildings = Building::whereNotNull('geometry')
                ->get()
                ->map(function ($building) {
                    // Get geometry as GeoJSON
                    $geometry = DB::selectOne("
                        SELECT ST_AsGeoJSON(geometry) as geojson
                        FROM buildings 
                        WHERE id = ?
                    ", [$building->id]);

                    return [
                        'type' => 'Feature',
                        'properties' => array_merge(
                            $building->properties ?? [],
                            [
                                'id' => $building->id,
                                'name' => $building->name,
                                'height' => $building->height,
                                'created_at' => $building->created_at,
                                'updated_at' => $building->updated_at
                            ]
                        ),
                        'geometry' => $geometry ? json_decode($geometry->geojson) : null
                    ];
                });

            $geojson = [
                'type' => 'FeatureCollection',
                'features' => $buildings
            ];

            return response()->json([
                'success' => true,
                'data' => $geojson
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch buildings GeoJSON: ' . $e->getMessage()
            ], 500);
        }
    }
}