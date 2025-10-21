const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import { alertSwalError } from "../../sweetAlert/sweetAlert.js";

export const geocodingPlace = async (address) => {
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


