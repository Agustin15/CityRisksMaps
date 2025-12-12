const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { createContext, useContext, useRef, useState } from "react";
import { alertSwalError } from "../components/sweetAlert/sweetAlert.js";

const SearchPlaceContext = createContext();

export const SearchPlaceProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placesSearched, setPlacesSearched] = useState(null);
  const [valueSearchedByText, setValueSearchedByText] = useState();
  const [infoWindow, setInfoWindow] = useState();
  const [valueInput, setValueInput] = useState("");
  const inputRef = useRef(null);
  const [loadingPlace, setLoadingPlace] = useState(false);

  const handleCleanInput = async () => {
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

  const handleChangeInput = (event) => {
    if (event.target.value.length == 0) {
      setSelectedPlace();
    }
    setValueInput(event.target.value);
  };

  const handleClickOnMap = async (event, marker) => {
    if (event.detail.placeId) {
      setInfoWindow();
      let placeDetails = await moreDetailsPlace(event.detail.placeId);
      setValueInput(placeDetails.displayName.text);
      setSelectedPlace(placeDetails);
    } else {
      setSelectedPlace();

      marker.position = event.detail.latLng;
      getReverseGeocodification(event.detail.latLng);
    }
  };

  const placeAutocompleteChanged = async (placeAutocomplete) => {
    placeAutocomplete.addListener("place_changed", async () => {
      let place_changed = placeAutocomplete.getPlace();

      if (place_changed.place_id) {
        let detailsPlace = await moreDetailsPlace(place_changed.place_id);
        if (detailsPlace) {
          setValueInput(detailsPlace.displayName.text);
          setSelectedPlace(detailsPlace);
        }
      } else {
        const results = await geocodingPlaceByAddress(inputRef.current.value);
        if (results) {
          let detailsPlace = await moreDetailsPlace(results[0].place_id);
          if (detailsPlace) setSelectedPlace(detailsPlace);
        }
      }
    });
  };

  const moreDetailsPlace = async (placeId) => {
    setLoadingPlace(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=*&languageCode=es&key=${API_KEY}`
      );

      const result = await response.json();

      if (response.status != 200)
        throw new Error("Sitio solicitado no encontrado");

      console.log(result);
      if (result) return result;
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

  const geocodingPlaceByAddress = async (address) => {
    setLoadingPlace(true);
    try {
      const geocoder = new google.maps.Geocoder();

      const result = await geocoder.geocode({
        address: address
      });

      if (result) return result.results;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPlace(false);
    }
  };
  const searchByText = async (userLocation) => {
    setValueSearchedByText(inputRef.current.value);
    const { Place } = await google.maps.importLibrary("places");

    const request = {
      textQuery: inputRef.current.value,
      fields: ["*"],
      includedType: "",
      useStrictTypeFiltering: true,
      locationBias: userLocation,
      isOpenNow: false,
      language: "es",
      maxResultCount: 5,
      minRating: 4,
      region: "UY"
    };

    let { places } = await Place.searchByText(request);
    let placesDetails = [];

    if (places) {
      for (const place of places) {
        const placeDetail = await moreDetailsPlace(place.id);
        if (!placeDetail) return;
        placesDetails.push(placeDetail);
      }
    }

    if (placesDetails.length > 0) setPlacesSearched(placesDetails);
  };

  return (
    <SearchPlaceContext.Provider
      value={{
        valueInput,
        setValueInput,
        inputRef,
        handleChangeInput,
        handleCleanInput,
        setInfoWindow,
        infoWindow,
        selectedPlace,
        setSelectedPlace,
        placesSearched,
        placeAutocompleteChanged,
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
