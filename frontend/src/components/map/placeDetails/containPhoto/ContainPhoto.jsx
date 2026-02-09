import styles from "./ContainPhoto.module.css";
import imageNotFound from "../../../../assets/img/imageNotFound.png";
import gallery from "../../../../assets/img/gallery.png";
import { useEffect } from "react";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";

export const ContainPhoto = ({ place }) => {
  const {
    getPhotoDetails,
    getStreetViewStaticImage,
    loading,
    setMainPhoto,
    mainPhoto,
    setShowPhotos
  } = usePhotosPlace();

  useEffect(() => {
    if (!place || mainPhoto) return;

    getMainPhoto(place.photos ? place.photos[0] : null);
  }, []);

  const getMainPhoto = async (photo) => {
    let url;
    if (photo) {
      url = await getPhotoDetails(photo.name, 400, 400, "mainPicture");
    } else {
      url = await getStreetViewStaticImage(
        400,
        400,
        place.location.latitude,
        place.location.longitude
      );
    }

    if (url) setMainPhoto(url);
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

      {place.photos && (
        <div className={styles.optionWatchPhotos}>
          <button onClick={() => setShowPhotos(true)}>
            Ver fotos
            <img src={gallery}></img>
          </button>
        </div>
      )}
    </div>
  );
};
