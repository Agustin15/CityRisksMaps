import { alertSwalError } from "../../sweetAlert/sweetAlert.js";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

export const getSuggestions = async (userLocation, value, setSuggestions) => {
  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "X-Goog-Api-Key": API_KEY
        },
        body: JSON.stringify({
          input: value,
          regionCode: "UY",
          locationBias: {
            circle: {
              center: {
                latitude: userLocation ? userLocation.lat : -34.89,
                longitude: userLocation ? userLocation.lng : -56.16
              },
              radius: 10000.0
            }
          }
        })
      }
    );
    const result = await response.json();

    if (result.suggestions) {
      setSuggestions(
        await detailsSuggestions(result.suggestions, setSuggestions)
      );
    } else setSuggestions();
  } catch (error) {
    console.log(error);
  }
};

export const detailsSuggestions = async (suggestions) => {
  return await Promise.all(
    await suggestions.map(async (suggestion) => {
      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places/${suggestion.placePrediction.placeId}?fields=displayName,location,formattedAddress&languageCode=es&key=${API_KEY}`
        );

        const result = await response.json();

        if (!response.ok) throw new Error("Sitio solicitado no encontrado");

        return result;
      } catch (error) {
        return alertSwalError("Ups,algo salio mal al buscar sitio", error);
      }
    })
  );
};

