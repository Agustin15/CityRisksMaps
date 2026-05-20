import { alertSwalError } from "../../sweetAlert/sweetAlert.js";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const getSuggestions = async (
  userLocation,
  setSuggestions,
  setLoadingPlace,
  value
) => {
  setLoadingPlace(true);
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

    if (!response.ok || !result.suggestions)
      throw new Error("Sitio solicitado no encontrado");

    setSuggestions(result.suggestions);
  } catch (error) {
    alertSwalError(
      "Ups algo salio mal al buscar el sitio",
      error.message || "Error en la solicitud"
    );
  } finally {
    setLoadingPlace(false);
  }
};

export const getMontevideoGeoJson = async () => {
  try {
    const response = await fetch(LOCALHOST_FRONTEND + "/montevideo.json");
    const result = await response.json();

    if (!response.ok)
      throw new Error("Error al obtener las coordenas de Montevideo");

    if (result) {
      return result.features[0].geometry.coordinates.flat().flat();
    }
  } catch (error) {
    throw error;
  }
};
