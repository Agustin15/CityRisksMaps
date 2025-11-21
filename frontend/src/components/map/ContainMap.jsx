import {
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useAdvancedMarkerRef,
  InfoWindow
} from "@vis.gl/react-google-maps";
const MAP_ID = import.meta.env.VITE_MAP_ID;

import { useMapControls } from "../../contexts/MapContext";
import { usePhotosPlace } from "../../contexts/PhotosContext";
import { MyLocation } from "./myLocation/MyLocation";
import { PlaceAutocomplete } from "./placeAutocomplete/PlaceAutocomplete";
import "./placeAutocomplete/PlaceAutocomplete.css";
import { MapHandler } from "./mapHandler/MapHandler";
import { PlaceDetails } from "./placeDetails/PlaceDetails";
import { DetailsStreet } from "./detailsStreet/DetailsStreet";
import { PhotosList } from "./placeDetails/photosList/photosList";
import { Modal } from "./modal/Modal";
import { MyGeolocation } from "./myGeolocation/MyGeolocation";
import { OptionsCrimes } from "./optionsCrimes/OptionsCrimes";
import { useZoneCrimes } from "../../contexts/ZoneCrimesContext.jsx";
import { MenuRoute } from "./menuRoute/MenuRoute";
import { useState } from "react";
import { useRoutes } from "../../contexts/RoutesContext";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { handleMouseNeighborhoohdPolygon } from "./handleNeighborhhodPolygon/handleMouseNeighborhood.js";
import { FormAdd } from "./quizes/formAdd/FormAdd.jsx";
import { useQuizes } from "../../contexts/QuizesContext.jsx";
import { FormAddQuizProvider } from "../../contexts/FormAddQuizContext.jsx";

export const ContainMap = () => {
  const { userLocation, handleClickOnMap, infoWindow, setInfoWindow } =
    useMapControls();
  const { polygons } = useZoneCrimes();
  const { showPhotos } = usePhotosPlace();
  const { showMenuRoutes } = useRoutes();
  const { newQuiz } = useQuizes();

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [polygonSelected, setPolygonSelected] = useState();
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
        onMousemove={(event) =>
          handleMouseNeighborhoohdPolygon(event, polygons, setPolygonSelected)
        }
        zoomControl={true}
        gestureHandling="greedy"
        mapId={MAP_ID}
      >
        <AdvancedMarker position={userLocation ? userLocation : null}>
          <MyLocation />
        </AdvancedMarker>

        <AdvancedMarker ref={markerRef} position={null}></AdvancedMarker>

        <MapControl position={ControlPosition.TOP_LEFT}>
          <PlaceAutocomplete marker={marker} onPlaceSelect={setSelectedPlace} />
          {selectedPlace && <PlaceDetails place={selectedPlace} />}
          {showMenuRoutes && <MenuRoute />}
        </MapControl>

        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
          <MyGeolocation />
        </MapControl>
        <MapHandler place={selectedPlace} marker={marker} />

        <MapControl position={ControlPosition.RIGHT_TOP}>
          <OptionsCrimes />
        </MapControl>

        <InfoWindow
          onCloseClick={() => setInfoWindow()}
          position={infoWindow ? infoWindow.results[0].geometry.location : null}
        >
          {infoWindow && (
            <DetailsStreet place={selectedPlace} infoWindow={infoWindow} />
          )}
        </InfoWindow>

        {polygonSelected && (
          <AdvancedMarker
            position={polygonSelected ? polygonSelected.data.center : null}
          >
            <InfoWindowNeighborhood polygonSelected={polygonSelected} />
          </AdvancedMarker>
        )}
      </Map>

      {showPhotos && (
        <Modal>
          <PhotosList place={selectedPlace} />
        </Modal>
      )}

      {newQuiz && (
        <Modal>
          <FormAddQuizProvider>
            <FormAdd />
          </FormAddQuizProvider>
        </Modal>
      )}
    </>
  );
};
