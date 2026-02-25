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
      {photosList &&
        (windowWidth >= 1200 ? (
          <img
            className={photosList ? styles.mainPhoto : styles.imageNotFound}
            src={photosList ? photosList[1].url : imageNotFound}
          ></img>
        ) : (
          <Preview photosList={photosList} />
        ))}

      {!photosList && <span>Imagenes no encontradas</span>}

      {photosList.length > 1 && windowWidth >= 1200 && (
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
