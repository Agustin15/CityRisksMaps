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

    if (result.suggestions) setSuggestions(result.suggestions);
    else setSuggestions();
  } catch (error) {
    console.log(error);
  }
};
