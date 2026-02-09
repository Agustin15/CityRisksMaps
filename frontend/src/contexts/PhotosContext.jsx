import { createContext, useContext, useState } from "react";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const PhotosContext = createContext();

export const PhotosProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [showPhotos, setShowPhotos] = useState(false);
  const [mainPhoto, setMainPhoto] = useState();

  const getPhotoDetails = async (
    namePhoto,
    maxHeightPx,
    maxWidthPx,
    option
  ) => {
    if (option == "mainPicture") setLoading(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/${namePhoto}/media?key=${API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
      );

      if (!response.ok) throw new Error("Error al buscar foto");

      const result = response.url;
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      if (option == "mainPicture") setLoading(false);
    }
  };

  const getStreetViewStaticImage = async (width, height, lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&heading=151.7&pitch=-0.76&key=${API_KEY}`
      );

      const result = response.url;

      if (result) return result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhotosContext.Provider
      value={{
        getPhotoDetails,
        getStreetViewStaticImage,
        loading,
        setLoading,
        loadingMore,
        setLoadingMore,
        setShowPhotos,
        showPhotos,
        mainPhoto,
        setMainPhoto
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotosPlace = () => useContext(PhotosContext);
