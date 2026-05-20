import { createContext, useContext, useRef, useState } from "react";
import { useMapControls } from "../MapContext.jsx";
import { useMap } from "@vis.gl/react-google-maps";
import { usePhotosPlace } from "../PhotosContext.jsx";
import { alertSwalError } from "../../components/sweetAlert/sweetAlert.js";
import {
  getGeocodification,
  getMoreDetailsPlace,
  getPlacesByText
} from "./functions.js";

const SearchPlaceContext = createContext();

export const SearchPlaceProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placesSearched, setPlacesSearched] = useState(null);
  const [streetSelected, setStreetSelected] = useState(null);
  const [valueSearchedByText, setValueSearchedByText] = useState();
  const [valueInput, setValueInput] = useState("");
  const [loadingPlace, setLoadingPlace] = useState(false);
  const inputRef = useRef(null);

  const map = useMap("mainMap");
  const { userLocation } = useMapControls();
  const { setPhotosList, createPhotosList } = usePhotosPlace();

  const handleCleanInput = async (setSuggestions) => {
    setSuggestions();

    switch (true) {
      case selectedPlace != null:
        setPhotosList();
        setSelectedPlace();
        if (placesSearched) setValueInput(valueSearchedByText);
        else setValueInput("");
        break;
      case placesSearched != null:
        setPlacesSearched();
        setValueSearchedByText();
        setValueInput("");
        break;
      case streetSelected != null:
        setStreetSelected();
        setValueInput("");
        break;
    }
  };

  const handleClickOnMap = async (event) => {
    if (event.detail.placeId) {
      setStreetSelected(null);
      await moreDetailsPlace(event.detail.placeId, true);
    } else {
      setSelectedPlace(null);
      getGeocodification(
        event.detail.latLng,
        null,
        setValueInput,
        setStreetSelected
      );
    }
  };

  const moreDetailsPlace = async (placeId, optionSetPlace) => {
    setLoadingPlace(true);
    try {
      const result = await getMoreDetailsPlace(placeId);

      if (result && optionSetPlace) {
        setPhotosList(await createPhotosList(result));
        setSelectedPlace(result);
        setValueInput(result.displayName.text);

        map.setZoom(15);
        map.panTo({
          lat: result.location.latitude,
          lng: result.location.longitude
        });
      }
    } catch (error) {
      alertSwalError("Ups,algo salio mal al buscar sitio", error.message || "Error en la solicitud");
    } finally {
      setLoadingPlace(false);
    }
  };

  const searchByText = async () => {
    setLoadingPlace(true);
    try {
      const result = await getPlacesByText(
        inputRef.current.value,
        userLocation
      );

      await Promise.all(
        result.places.map(async (place) => {
          const list = await createPhotosList(place);
          place.photosList = list;
          return place;
        })
      );

      if (result.places.length == 1) {
        setSelectedPlace(result.places[0]);
        setPhotosList(result.places[0].photosList);
      } else {
        setPlacesSearched(result.places);
        setValueSearchedByText(inputRef.current.value);
      }

      map.setZoom(15);
      map.panTo({
        lat: result.places[0].location.latitude,
        lng: result.places[0].location.longitude
      });

      return true;
    } catch (error) {
      console.log(error.message || "Error en la solicitud");
      return false;
    } finally {
      setLoadingPlace(false);
    }
  };

  const handleClickOnSuggestionAddress = (address) => {
    getGeocodification(null, address, setValueInput, setStreetSelected);
  };

  return (
    <SearchPlaceContext.Provider
      value={{
        valueInput,
        setValueInput,
        inputRef,
        handleCleanInput,
        selectedPlace,
        setSelectedPlace,
        setPlacesSearched,
        placesSearched,
        streetSelected,
        setStreetSelected,
        moreDetailsPlace,
        handleClickOnMap,
        handleClickOnSuggestionAddress,
        searchByText,
        loadingPlace,
        setLoadingPlace
      }}
    >
      {children}
    </SearchPlaceContext.Provider>
  );
};

export const useSearchPlace = () => useContext(SearchPlaceContext);
