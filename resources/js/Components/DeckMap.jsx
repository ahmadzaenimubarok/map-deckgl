import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import { useState, useEffect } from "react";

export default function DeckMap() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const viewState = {
    longitude: 110.424088,
    latitude: -7.050475,
    zoom: 15,
    pitch: 45,
    bearing: 0
  };

  // Fetch building data from database
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
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const layers = [
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
    <DeckGL
      initialViewState={viewState}
      controller={true}
      layers={layers}
      style={{ width: "100%", height: "80vh" }}
    >
      <Map
        mapLib={maplibregl}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <NavigationControl position="top-right" />
      </Map>
    </DeckGL>
  );
}
