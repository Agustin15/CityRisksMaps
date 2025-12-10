const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { alertSwalError } from "../../sweetAlert/sweetAlert.js";

export const searchByText = async (userLocation, text, moreDetailsPlace) => {
  const { Place } = await google.maps.importLibrary("places");

  const request = {
    textQuery: text,
    fields: ["*"],
    includedType: "",
    useStrictTypeFiltering: true,
    locationBias: userLocation,
    isOpenNow: true,
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

  return placesDetails;
};

export const placeAutocompleteChanged = async (
  placeAutocomplete,
  setSelectedPlace,
  moreDetailsPlace,
  setValueInput
) => {
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

export const geocodingPlaceByAddress = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
    );

    const result = await response.json();

    if (result.status != "OK") {
      alertSwalError(
        "Ups,no pudimos encontrar la ubicacion",
        "Error inesperado en la geocodificacion"
      );
    } else {
      return result.results;
    }
  } catch (error) {
    console.log(error);
  }
};
