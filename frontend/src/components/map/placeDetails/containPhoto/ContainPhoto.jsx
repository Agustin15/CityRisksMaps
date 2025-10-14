import { useEffect, useState } from "react";
import { useMapControls } from "../../../../contexts/MapContext";
import imageNotFound from "../../../../assets/img/imageNotFound.png";
import styles from "./ContainPhoto.module.css";
import { PhotosList } from "../photosList/photosList";

export const ContainPhoto = ({ place }) => {
  const { getPhotoDetails, loading } = useMapControls();
  const [mainPhoto, setMainPhoto] = useState();
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (!place || !place.photos) return;
    getMainPhoto();
  }, [place]);

  const getMainPhoto = async () =>
    setMainPhoto(await getPhotoDetails(place.photos[0].name));

  return (
    <div onMouseLeave={() => setShowBtn(false)} className={styles.containPhoto}>
      {loading && <span className={styles.loader}></span>}
      {!loading && (
        <img
          onMouseEnter={() => setShowBtn(true)}
          className={mainPhoto ? styles.mainPhoto : styles.imageNotFound}
          src={mainPhoto ? mainPhoto : imageNotFound}
        ></img>
      )}
      {!loading && !mainPhoto && <span>Imagen no encontrada</span>}

      {showBtn && (
        <div className={styles.optionWatchPhotos}>
          <button>Ver fotos</button>
        </div>
      )}
    </div>
  );
};
