import {
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useAdvancedMarkerRef,
  InfoWindow
} from "@vis.gl/react-google-maps";

import { useState } from "react";
import { MyLocation } from "./myLocation/MyLocation";
import { useMapControls } from "../../contexts/MapContext";
import { PlaceAutocomplete } from "./placeAutocomplete/PlaceAutocomplete";
import { MapHandler } from "./mapHandler/MapHandler";
import { PlaceDetails } from "./placeDetails/PlaceDetails";
import "./placeAutocomplete/PlaceAutocomplete.css";
import { DetailsStreet } from "./detailsStreet/DetailsStreet";

export const ContainMap = () => {
  const { markerUserLocation, handleClickOnMap, infoWindow } = useMapControls();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <Map
      style={{ width: "100vw", height: "100vh" }}
      disableDefaultUI
      defaultZoom={15}
      defaultCenter={{ lat: -34.8340562, lng: -56.3622838 }}
      streetViewControl={true}
      onClick={(event) => handleClickOnMap(event, marker, setSelectedPlace)}
      zoomControl={true}
      gestureHandling="greedy"
      mapId="e511213c5dfb9c1e77fabd51"
    >
      <AdvancedMarker position={null} ref={markerUserLocation}>
        <MyLocation />
      </AdvancedMarker>

      <AdvancedMarker ref={markerRef} position={null}></AdvancedMarker>

      <MapControl position={ControlPosition.TOP_LEFT}>
        <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
      </MapControl>

      <MapHandler place={selectedPlace} marker={marker} />
      {selectedPlace && <PlaceDetails place={selectedPlace} />}

      <InfoWindow
        position={infoWindow ? infoWindow.results[0].geometry.location : null}
      >
        {infoWindow && <DetailsStreet infoWindow={infoWindow} />}
      </InfoWindow>
    </Map>
  );
};
