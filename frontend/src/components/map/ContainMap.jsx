import {
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useAdvancedMarkerRef,
  InfoWindow
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { useMapControls } from "../../contexts/MapContext";
import { usePhotosPlace } from "../../contexts/PhotosContext";
import { MyLocation } from "./myLocation/MyLocation";
import { PlaceAutocomplete } from "./placeAutocomplete/PlaceAutocomplete";
import { MapHandler } from "./mapHandler/MapHandler";
import { PlaceDetails } from "./placeDetails/PlaceDetails";
import "./placeAutocomplete/PlaceAutocomplete.css";
import { DetailsStreet } from "./detailsStreet/DetailsStreet";
import { PhotosList } from "./placeDetails/photosList/photosList";
import { Modal } from "./modal/Modal";
import { MyGeolocation } from "./myGeolocation/MyGeolocation";
import { OptionsCrimes } from "./optionsCrimes/OptionsCrimes";
import { ZoneCrimesProvider } from "../../contexts/zoneCrimesContext/ZoneCrimesContext";

export const ContainMap = () => {
  const { userLocation, handleClickOnMap, infoWindow, setInfoWindow } =
    useMapControls();
  const { showPhotos } = usePhotosPlace();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
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
        <AdvancedMarker position={userLocation ? userLocation : null}>
          <MyLocation />
        </AdvancedMarker>

        <AdvancedMarker ref={markerRef} position={null}></AdvancedMarker>

        <MapControl position={ControlPosition.TOP_LEFT}>
          <PlaceAutocomplete marker={marker} onPlaceSelect={setSelectedPlace} />
          {selectedPlace && <PlaceDetails place={selectedPlace} />}
        </MapControl>

        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <MyGeolocation />
        </MapControl>
        <MapHandler place={selectedPlace} marker={marker} />

        <MapControl position={ControlPosition.RIGHT_TOP}>
          <ZoneCrimesProvider>
            <OptionsCrimes />
          </ZoneCrimesProvider>
        </MapControl>

        <InfoWindow
          onCloseClick={() => setInfoWindow()}
          position={infoWindow ? infoWindow.results[0].geometry.location : null}
        >
          {infoWindow && <DetailsStreet infoWindow={infoWindow} />}
        </InfoWindow>
      </Map>

      {showPhotos && (
        <Modal>
          <PhotosList place={selectedPlace} />
        </Modal>
      )}

      
    </>
  );
};
