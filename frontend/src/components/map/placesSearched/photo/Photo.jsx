import styles from "./Photo.module.css";
import imageNotFound from "../../../../assets/img/imageNotFound.png";
import { useEffect } from "react";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";

export const Photo = ({ place }) => {
  const {
    getPhotoDetails,
    getStreetViewStaticImage,
    mainPhoto,
    setMainPhoto,
    loading
  } = usePhotosPlace();

  useEffect(() => {
    if (mainPhoto) return;
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
      {!loading && !mainPhoto && (
        <img className={styles.imageNotFound} src={imageNotFound}></img>
      )}
      {!loading && mainPhoto && <img src={mainPhoto}></img>}
    </div>
  );
};
