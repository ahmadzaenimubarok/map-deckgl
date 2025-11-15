import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import { useState, useEffect } from "react";

export default function DeckMap() {
  const [buildings, setBuildings] = useState([]);
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('scatterplot'); // 'scatterplot' or 'polygon'

  const viewState = {
    longitude: 110.424088,
    latitude: -7.050475,
    zoom: 15,
    pitch: 45,
    bearing: 0
  };

  // Fetch building data for scatterplot
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('/buildings');
        const result = await response.json();
        
        if (result.success) {
          setBuildings(result.data);
        } else {
          setError(result.message || 'Failed to fetch buildings');
        }
      } catch (err) {
        setError('Error fetching building data: ' + err.message);
      }
    };

    fetchBuildings();
  }, []);

  // Fetch GeoJSON data for polygon layer
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch('/buildings/geojson');
        const result = await response.json();
        
        if (result.success) {
          setGeojsonData(result.data);
        } else {
          setError(result.message || 'Failed to fetch GeoJSON data');
        }
      } catch (err) {
        setError('Error fetching GeoJSON data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
  }, []);

  const layers = [
    // Scatterplot layer (shown when viewMode is 'scatterplot')
    ...(viewMode === 'scatterplot' ? [
      new ScatterplotLayer({
        id: "buildings",
        data: buildings,
        getPosition: d => d.position,
        getRadius: d => Math.max(10, (d.height || 20) / 2), // Radius based on height
        getFillColor: d => {
          // Color based on height or default red
          const height = d.height || 20;
          if (height > 100) return [255, 0, 0]; // Red for tall buildings
          if (height > 50) return [255, 165, 0]; // Orange for medium buildings
          return [0, 255, 0]; // Green for short buildings
        },
        pickable: true,
        radiusMinPixels: 5,
        radiusMaxPixels: 30,
      })
    ] : []),
    
    // Polygon layer (shown when viewMode is 'polygon')
    ...(viewMode === 'polygon' && geojsonData ? [
      new GeoJsonLayer({
        id: "buildings-polygon",
        data: geojsonData,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false, // No extrusion, just 2D polygons
        wireframe: false,
        lineWidthMinPixels: 1,
        getFillColor: d => {
          // Color based on building height
          const height = d.properties?.height || 20;
          if (height > 100) return [255, 0, 0, 180]; // Red with transparency
          if (height > 50) return [255, 165, 0, 180]; // Orange with transparency
          return [0, 255, 0, 180]; // Green with transparency
        },
        getLineColor: [0, 0, 0, 255], // Black borders
        getLineWidth: 1,
      })
    ] : [])
  ];

  if (loading) {
    return (
      <div style={{ 
        width: "100%", 
        height: "80vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
        <div>Loading building data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: "100%", 
        height: "80vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        color: "red" 
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: "100%", height: "80vh" }}>
      {/* Toggle Switch */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {viewMode === 'scatterplot' ? 'Scatterplot' : 'Polygon'}
        </span>
        <label style={{
          position: 'relative',
          display: 'inline-block',
          width: '60px',
          height: '30px'
        }}>
          <input
            type="checkbox"
            checked={viewMode === 'polygon'}
            onChange={() => setViewMode(viewMode === 'scatterplot' ? 'polygon' : 'scatterplot')}
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: viewMode === 'scatterplot' ? '#ccc' : '#2196F3',
            transition: '0.4s',
            borderRadius: '30px'
          }}>
            <span style={{
              position: 'absolute',
              content: '""',
              height: '22px',
              width: '22px',
              left: '4px',
              bottom: '4px',
              backgroundColor: 'white',
              transition: '0.4s',
              borderRadius: '50%',
              transform: viewMode === 'polygon' ? 'translateX(30px)' : 'translateX(0)'
            }}></span>
          </span>
        </label>
      </div>

      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        style={{ width: "100%", height: "100%" }}
      >
        <Map
          mapLib={maplibregl}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <NavigationControl position="top-right" />
        </Map>
      </DeckGL>
    </div>
  );
}
