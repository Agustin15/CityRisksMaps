const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { alertSwalError } from "../../components/sweetAlert/sweetAlert.js";

export const getMoreDetailsPlace = async (placeId) => {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=location,formattedAddress,shortFormattedAddress,rating,primaryTypeDisplayName,addressComponents,editorialSummary,regularOpeningHours,nationalPhoneNumber,userRatingCount,websiteUri,accessibilityOptions,photos,displayName,iconMaskBaseUri,iconBackgroundColor&languageCode=es&key=${API_KEY}`,
    );

    const result = await response.json();

    if (response.status != 200)
      throw new Error("Sitio solicitado no encontrado");

    return result;
  } catch (error) {
    throw error;
  }
};

export const getPlacesByText = async (inputValue, userLocation) => {
  const request = {
    textQuery: inputValue,
    includedType: "",
    strictTypeFiltering: true,
    rankPreference: "DISTANCE",
    locationBias: {
      circle: {
        center: {
          latitude: userLocation ? userLocation.lat : -34.89,
          longitude: userLocation ? userLocation.lng : -56.16,
        },
        radius: 5000.0,
      },
    },
    pageSize: 10,
    openNow: false,
    languageCode: "es",
    minRating: 3,
    regionCode: "UY",
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
            "places.location,places.formattedAddress,places.shortFormattedAddress,places.id,places.rating,places.primaryTypeDisplayName,places.addressComponents,places.editorialSummary,places.regularOpeningHours,places.nationalPhoneNumber,places.userRatingCount,places.websiteUri,places.accessibilityOptions,places.photos,places.displayName,places.iconMaskBaseUri,places.iconBackgroundColor",
        },
      },
    );

    const result = await response.json();

    if (response.status != 200 || !result.places)
      throw new Error("Sitio solicitado no encontrado");

    return result;
  } catch (error) {
    console.log(error.message || "Error en la solicitud");
    throw error;
  }
};

export const getGeocodification = async (
  latLng,
  address,
  setValueInput,
  setStreetSelected,
) => {
  try {
    const geocoder = new google.maps.Geocoder();

    const request = latLng
      ? {
          location: latLng,
        }
      : {
          address: address,
        };

    const resultGeocodification = await geocoder.geocode(request);

    if (
      resultGeocodification.results &&
      findPostalCode(resultGeocodification.results[0].address_components)
    ) {
      setValueInput(resultGeocodification.results[0].formatted_address);
      setStreetSelected(resultGeocodification.results);
    } else throw new Error("Error inesperado en la geocodificacion");
  } catch (error) {
    alertSwalError(
      "Ups,no pudimos encontrar la ubicacion",
      error.message || "Error en la solicitud",
    );
  }
};

const findPostalCode = (addressComponent) => {
  return addressComponent.find((component) =>
    component.types.includes("postal_code"),
  );
};
