<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'height',
        'properties',
        'geometry'
    ];

    protected $casts = [
        'properties' => 'array',
        'height' => 'float'
    ];

    /**
     * Get the geometry as GeoJSON
     */
    public function getGeometryAsGeoJson()
    {
        if (!$this->geometry) {
            return null;
        }

        return \DB::selectOne("SELECT ST_AsGeoJSON({$this->geometry}) as geojson")->geojson;
    }

    /**
     * Get the building as GeoJSON feature
     */
    public function toGeoJsonFeature()
    {
        $geometry = $this->getGeometryAsGeoJson();
        
        return [
            'type' => 'Feature',
            'properties' => array_merge(
                $this->properties ?? [],
                [
                    'id' => $this->id,
                    'name' => $this->name,
                    'height' => $this->height,
                    'created_at' => $this->created_at,
                    'updated_at' => $this->updated_at
                ]
            ),
            'geometry' => $geometry ? json_decode($geometry) : null
        ];
    }
}