import { createContext, useContext, useState } from "react";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const PhotosContext = createContext();

export const PhotosProvider = ({ children }) => {
  const [showPhotos, setShowPhotos] = useState(false);
  const [photosList, setPhotosList] = useState();
  const [imageStreet, setImageStreet] = useState();
  const [indexSelected, setIndexSelected] = useState(0);

  const getPhotoDetails = async (namePhoto, maxHeightPx, maxWidthPx) => {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/${namePhoto}/media?key=${API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
      );

      if (!response.ok)
        throw new Error("No se pudieron encontrar imagenes del sitio");

      const result = response.url;
      return result;
    } catch (error) {
      throw new Error(error.message || "Error en la solicitud");
    }
  };

  const createPhotosList = async (place) => {
    try {
      const photos = await Promise.all(
        place.photos.map(async (photo) => {
          let url = await getPhotoDetails(photo.name, 340, 865);

          return {
            url: url,
            author:
              photo.authorAttributions.length > 0
                ? photo.authorAttributions[0]
                : null
          };
        })
      );

      if (photos) {
        return photos;
      }
    } catch (error) {
      console.log(error.message || "Error en la solicitud");
      throw error;
    }
  };

  const getStreetViewStaticImage = async (width, height, lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&heading=151.7&pitch=-0.76&key=${API_KEY}`
      );

      if (!response.ok)
        throw new Error("Imagen de la calle solicitada no pudo encontrarse");

      const result = response.url;

      if (result) {
        setImageStreet(result);
      }
    } catch (error) {
      throw new Error(error.message || "Error en la solicitud");
    }
  };

  return (
    <PhotosContext.Provider
      value={{
        createPhotosList,
        getStreetViewStaticImage,
        setShowPhotos,
        showPhotos,
        photosList,
        setPhotosList,
        setIndexSelected,
        indexSelected,
        imageStreet,
        setImageStreet
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotosPlace = () => useContext(PhotosContext);
