import styles from "./ContainPhoto.module.css";
import imageNotFound from "../../../../assets/img/imageNotFound.png";
import gallery from "../../../../assets/img/gallery.png";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";
import { useWindowResize } from "../../../../contexts/WindowResizeContext";
import { Preview } from "./preview/Preview";

export const ContainPhoto = () => {
  const { photosList, setShowPhotos } = usePhotosPlace();
  const { windowWidth } = useWindowResize();

  return (
    <div className={styles.containPhoto}>
      {!photosList && (
        <div className={styles.noPhotosFound}>
          <img className={styles.mainPhoto} src={imageNotFound}></img>
          <span>Imagenes no encontradas</span>
        </div>
      )}

      {photosList && <Preview photosList={photosList} />}
    </div>
  );
};
