const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { createContext, useContext, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useMapControls } from "./MapContext.jsx";

const SearchPlaceContext = createContext();

export const SearchPlaceProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placesSearched, setPlacesSearched] = useState(null);
  const [valueSearchedByText, setValueSearchedByText] = useState();
  const [valueInput, setValueInput] = useState("");
  const inputRef = useRef(null);
  const [loadingPlace, setLoadingPlace] = useState(false);
  const { userLocation, boundsMontevideo } = useMapControls();

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
        `https://places.googleapis.com/v1/places/${placeId}?fields=location,formattedAddress,shortFormattedAddress,rating,primaryTypeDisplayName,addressComponents,editorialSummary,regularOpeningHours,nationalPhoneNumber,userRatingCount,websiteUri,accessibilityOptions,photos,displayName,iconMaskBaseUri,iconBackgroundColor&languageCode=es&key=${API_KEY}`
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

      if (result) {
        await moreDetailsPlace(result.results[0].place_id, true);
      } else throw new Error("Error inesperado en la geocodificacion");
    } catch (error) {
      alertSwalError("Ups,no pudimos encontrar la ubicacion", error);
      console.log(error);
    }
  };

  const geocodingPlaceByAddress = async (address) => {
    setLoadingPlace(true);

    const boundsMdveo = boundsMontevideo();

    try {
      const geocoder = new google.maps.Geocoder();

      const result = await geocoder.geocode({
        address: address,
        bounds: boundsMdveo
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

    const request = {
      textQuery: inputRef.current.value,
      includedType: "",
      strictTypeFiltering: true,
      rankPreference: "DISTANCE",
      locationBias: {
        circle: {
          center: {
            latitude: userLocation ? userLocation.lat : -34.89,
            longitude: userLocation ? userLocation.lng : -56.16
          },
          radius: 5000.0
        }
      },
      pageSize: 10,
      openNow: false,
      languageCode: "es",
      minRating: 3,
      regionCode: "UY"
    };

    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          body: JSON.stringify(request),
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask":
              "places.location,places.formattedAddress,places.shortFormattedAddress,places.rating,places.primaryTypeDisplayName,places.addressComponents,places.editorialSummary,places.regularOpeningHours,places.nationalPhoneNumber,places.userRatingCount,places.websiteUri,places.accessibilityOptions,places.photos,places.displayName,places.iconMaskBaseUri,places.iconBackgroundColor"
          }
        }
      );

      const result = await response.json();

      if (response.status != 200)
        throw new Error("Sitio solicitado no encontrado");

      setPlacesSearched(result.places);
    } catch (error) {
      console.log(error.message);
      alertSwalError("Ups,no pudimos encontrar el sitio", error);
    }
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
