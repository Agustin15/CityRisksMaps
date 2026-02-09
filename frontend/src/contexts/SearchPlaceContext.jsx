const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { createContext, useContext, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";
import { useMapControls } from "./MapContext.jsx";
import { useMap } from "@vis.gl/react-google-maps";
import { usePhotosPlace } from "./PhotosContext.jsx";

const SearchPlaceContext = createContext();

export const SearchPlaceProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placesSearched, setPlacesSearched] = useState(null);
  const [valueSearchedByText, setValueSearchedByText] = useState();
  const [valueInput, setValueInput] = useState("");
  const inputRef = useRef(null);
  const [loadingPlace, setLoadingPlace] = useState(false);

  const { userLocation } = useMapControls();
  const { setMainPhoto } = usePhotosPlace();
  const map = useMap();

  const handleCleanInput = async (setSuggestions) => {
    setSuggestions();
    if (selectedPlace) {
      setMainPhoto();
      setSelectedPlace();
      if (placesSearched) setValueInput(valueSearchedByText);
      else setValueInput("");
    } else if (placesSearched) {
      setPlacesSearched();
      setValueSearchedByText();
      setValueInput("");
    }
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

        map.setZoom(15);
        map.panTo({
          lat: result.location.latitude,
          lng: result.location.longitude
        });
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

  const searchByText = async () => {
    setLoadingPlace(true);

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
      else if (result.places) {
        if (result.places.length == 1) setSelectedPlace(result.places[0]);
        else {
          setPlacesSearched(result.places);
          setValueSearchedByText(inputRef.current.value);
        }

        map.setZoom(15);
        map.panTo({
          lat: result.places[0].location.latitude,
          lng: result.places[0].location.longitude
        });
      }

      return result.places;
    } catch (error) {
      console.log(error.message);
      alertSwalError("Ups,no pudimos encontrar el sitio", error);
    } finally {
      setLoadingPlace(false);
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
        setPlacesSearched,
        placesSearched,
        moreDetailsPlace,
        handleClickOnMap,
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
