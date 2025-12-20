const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { createContext, useContext, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useMapControls } from "./MapContext.jsx";

const SearchPlaceContext = createContext();

export const SearchPlaceProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placesSearched, setPlacesSearched] = useState(null);
  const [valueSearchedByText, setValueSearchedByText] = useState();
  const [infoWindow, setInfoWindow] = useState();
  const [valueInput, setValueInput] = useState("");
  const inputRef = useRef(null);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const { userLocation } = useMapControls();

  const handleCleanInput = async (setSuggestions, suggestions) => {
    if (suggestions) setSuggestions();

    if (selectedPlace) {
      setSelectedPlace();
      if (valueSearchedByText) {
        setValueInput(valueSearchedByText);
        return;
      }
    }
    if (placesSearched && !selectedPlace) {
      setPlacesSearched();
    }
    setValueInput("");
  };

  const handleClickOnMap = async (event, marker) => {
    if (event.detail.placeId) {
      setInfoWindow();
      await moreDetailsPlace(event.detail.placeId, true);
    } else {
      setSelectedPlace();
      marker.position = event.detail.latLng;
      getReverseGeocodification(event.detail.latLng);
    }
  };

  const moreDetailsPlace = async (placeId, optionSetPlace) => {
    setLoadingPlace(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=*&languageCode=es&key=${API_KEY}`
      );

      const result = await response.json();

      if (response.status != 200)
        throw new Error("Sitio solicitado no encontrado");

      if (result && optionSetPlace) {
        setSelectedPlace(result);
        setValueInput(result.displayName.text);
      }

      return result;
    } catch (error) {
      alertSwalError("Ups,algo salio mal al buscar sitio", error);
      console.log(error);
    } finally {
      setLoadingPlace(false);
    }
  };

  const getReverseGeocodification = async (latLng) => {
    try {
      const geocoder = new google.maps.Geocoder();

      const result = await geocoder.geocode({
        location: latLng
      });

      if (result) setInfoWindow(result);
      else throw new Error("Error inesperado en la geocodificacion");
    } catch (error) {
      alertSwalError("Ups,no pudimos encontrar la ubicacion", error);
      console.log(error);
    }
  };

  const geocodingPlaceByAddress = async (address, getMontevideoJson) => {
    setLoadingPlace(true);

    let bounds = new google.maps.LatLngBounds();
    let coordinatesMontevideo = await getMontevideoJson();

    if (coordinatesMontevideo) {
      coordinatesMontevideo.forEach((coordinate) =>
        bounds.extend({ lat: coordinate[1], lng: coordinate[0] })
      );
    }

    try {
      const geocoder = new google.maps.Geocoder();

      const result = await geocoder.geocode({
        address: address,
        bounds: bounds
      });

      if (result.results) {
        return result.results;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPlace(false);
    }
  };

  const searchByText = async () => {
    setValueSearchedByText(inputRef.current.value);
    const { Place } = await google.maps.importLibrary("places");

    const request = {
      textQuery: inputRef.current.value,
      fields: ["*"],
      includedType: "",
      useStrictTypeFiltering: true,
      locationBias: {
        lat: userLocation ? userLocation.lat : -34.89,
        lng: userLocation ? userLocation.lng : -56.16
      },
      isOpenNow: false,
      language: "es",
      maxResultCount: 10,
      minRating: 3,
      region: "UY"
    };

    let { places } = await Place.searchByText(request);
    let placesDetails = [];

    if (places && places.length > 0) {
      for (const place of places) {
        const placeDetail = await moreDetailsPlace(place.id, false);
        if (!placeDetail) return;
        placesDetails.push(placeDetail);
      }
    } else
      alertSwalError(
        "Ups,no pudimos encontrar la ubicacion",
        "Sitio no encontrado"
      );

    if (placesDetails.length > 0) setPlacesSearched(placesDetails);
  };

  return (
    <SearchPlaceContext.Provider
      value={{
        valueInput,
        setValueInput,
        inputRef,
        handleCleanInput,
        setInfoWindow,
        infoWindow,
        selectedPlace,
        setSelectedPlace,
        placesSearched,
        moreDetailsPlace,
        handleClickOnMap,
        geocodingPlaceByAddress,
        searchByText,
        loadingPlace
      }}
    >
      {children}
    </SearchPlaceContext.Provider>
  );
};

export const useSearchPlace = () => useContext(SearchPlaceContext);
