const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
import styles from "./ContainPhoto.module.css";
import imageNotFound from "../../../../assets/img/imageNotFound.png";
import gallery from "../../../../assets/img/gallery.png";
import { useEffect, useState } from "react";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";

export const ContainPhoto = ({ place }) => {
  const { getPhotoDetails, loading, setLoading, setShowPhotos } =
    usePhotosPlace();
  const [mainPhoto, setMainPhoto] = useState();

  useEffect(() => {
    if (!place) return;

    if (place.photos) {
      getMainPhoto();
    } else {
      getStreetViewStaticImage(
        340,
        240,
        place.location.latitude,
        place.location.longitude
      );
    }
  }, [place]);

  const getMainPhoto = async () =>
    setMainPhoto(
      await getPhotoDetails(place.photos[0].name, 240, 340, setLoading)
    );

  const getStreetViewStaticImage = async (width, height, lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&heading=151.7&pitch=-0.76&key=${API_KEY}`
      );

      const result = response.url;

      if (result) setMainPhoto(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containPhoto}>
      {loading && <span className={styles.loader}></span>}
      {!loading && (
        <img
          className={mainPhoto ? styles.mainPhoto : styles.imageNotFound}
          src={mainPhoto ? mainPhoto : imageNotFound}
        ></img>
      )}
      {!loading && !mainPhoto && <span>Imagen no encontrada</span>}

      <div className={styles.optionWatchPhotos}>
        <button onClick={() => setShowPhotos(true)}>
          Ver fotos
          <img src={gallery}></img>
        </button>
      </div>
    </div>
  );
};
