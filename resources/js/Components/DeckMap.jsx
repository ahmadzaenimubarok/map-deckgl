import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import maplibregl from "maplibre-gl";
import Map, { NavigationControl } from "react-map-gl/maplibre";

export default function DeckMap() {
  const viewState = {
    longitude: 110.366,
    latitude: -7.801,
    zoom: 15,
    pitch: 45,
    bearing: 0
  };

  const layers = [
    new ScatterplotLayer({
      id: "points",
      data: [{ position: [110.36625, -7.80125] }],
      getPosition: d => d.position,
      getRadius: () => 20,
      getFillColor: [255, 0, 0],
    })
  ];

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
        <NavigationControl position="top-left" />
      </Map>
    </DeckGL>
  );
}
