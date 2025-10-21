import { createContext, useContext, useState } from "react";
const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const PhotosContext = createContext();

export const PhotosProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  const getPhotoDetails = async (
    namePhoto,
    maxHeightPx,
    maxWidthPx,
    setOptionLoading
  ) => {
    setOptionLoading(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/${namePhoto}/media?key=${API_KEY}&maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}`
      );

      const result = response.url;
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setOptionLoading(false);
    }
  };

  return (
    <PhotosContext.Provider
      value={{
        getPhotoDetails,
        loading,
        setLoading,
        loadingMore,
        setLoadingMore,
        setShowPhotos,
        showPhotos
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotosPlace = () => useContext(PhotosContext);
