import styles from "./Photo.module.css";
import imageNotFound from "../../../../assets/img/imageNotFound.png";
import { useEffect, useState } from "react";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";

export const Photo = ({ photo }) => {
  const { getPhotoDetails } = usePhotosPlace();
  const [mainPhoto, setMainPhoto] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMainPhoto();
  }, []);

  const getMainPhoto = async () => {
    const url = await getPhotoDetails(photo.name, 400, 400, setLoading);
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
