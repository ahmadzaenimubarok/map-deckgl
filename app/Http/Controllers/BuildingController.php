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
}