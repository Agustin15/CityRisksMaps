import {
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
const MAP_ID = import.meta.env.VITE_MAP_ID;

import { useState } from "react";
import { useRoutes } from "../../contexts/RoutesContext";
import { useQuizes } from "../../contexts/quizesContext/QuizesContext.jsx";
import { useMapControls } from "../../contexts/MapContext";
import { usePhotosPlace } from "../../contexts/PhotosContext";
import { useZoneCrimes } from "../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { useSearchPlace } from "../../contexts/SearchPlaceContext.jsx";
import { MyLocation } from "./myLocation/MyLocation";
import { MapHandler } from "./mapHandler/MapHandler";
import { SearchPlace } from "./searchPlace/SearchPlace.jsx";
import { PlaceDetails } from "./placeDetails/PlaceDetails";
import { DetailsStreet } from "./detailsStreet/DetailsStreet";
import { PhotosList } from "./placeDetails/photosList/photosList";
import { Modal } from "./modal/Modal";
import { OptionsCrimes } from "./optionsCrimes/OptionsCrimes";
import { MenuRoute } from "./menuRoute/MenuRoute";
import { InfoWindowNeighborhood } from "./InfoWindowNeighborhood/InfoWindowNeighborhood";
import { handleMouseNeighborhoohdPolygon } from "./handleNeighborhhodPolygon/handleMouseNeighborhood.js";
import { FormAdd } from "./quizes/formAdd/FormAdd.jsx";
import { FormAddQuizProvider } from "../../contexts/quizesContext/FormAddQuizContext.jsx";
import { ListUserQuizes } from "./quizes/listUserQuizes/ListUserQuizes.jsx";
import { ListQuizesProvider } from "../../contexts/quizesContext/ListQuizesContext.jsx";
import { PlacesSearched } from "./placesSearched/PlacesSearched.jsx";


export const ContainMap = () => {
  const { userLocation } = useMapControls();
  const { polygons } = useZoneCrimes();
  const { showPhotos } = usePhotosPlace();
  const { showMenuRoutes } = useRoutes();
  const {
    selectedPlace,
    placesSearched,
    infoWindow,
    setInfoWindow,
    handleClickOnMap
  } = useSearchPlace();
  const { newQuiz, showListQuizes } = useQuizes();
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
        streetViewControlOptions={{
          position: ControlPosition.LEFT_BOTTOM
        }}
        onClick={(event) => handleClickOnMap(event, marker)}
        onMousemove={(event) =>
          handleMouseNeighborhoohdPolygon(event, polygons, setPolygonSelected)
        }
        zoomControl={true}
        zoomControlOptions={{
          position: ControlPosition.LEFT_BOTTOM
        }}
        gestureHandling="greedy"
        mapId={MAP_ID}
      >
        <AdvancedMarker position={userLocation ? userLocation : null}>
          <MyLocation />
        </AdvancedMarker>

        <AdvancedMarker ref={markerRef} position={null}></AdvancedMarker>

        <MapControl position={ControlPosition.TOP_LEFT}>
          <SearchPlace />
          {selectedPlace && <PlaceDetails place={selectedPlace} />}
          {placesSearched && <PlacesSearched />}
          {showMenuRoutes && <MenuRoute />}
        </MapControl>

        <MapHandler place={selectedPlace} marker={marker} />

        <MapControl position={ControlPosition.RIGHT_TOP}>
          <OptionsCrimes />
        </MapControl>

        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          {infoWindow && (
            <DetailsStreet
              infoWindow={infoWindow}
              setInfoWindow={setInfoWindow}
            />
          )}
        </MapControl>

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
      {showListQuizes && (
        <Modal>
          <ListQuizesProvider>
            <ListUserQuizes />
          </ListQuizesProvider>
        </Modal>
      )}
    </>
  );
};
