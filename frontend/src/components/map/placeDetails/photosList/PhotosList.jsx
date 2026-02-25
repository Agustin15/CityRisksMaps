import styles from "./PhotosList.module.css";
import { usePhotosPlace } from "../../../../contexts/PhotosContext";
import { Options } from "./options/Options";

export const PhotosList = () => {
  const { photosList, setShowPhotos, indexSelected } = usePhotosPlace();

  return (
    <div className={styles.containList}>
      <div className={styles.containClose}>
        <button onClick={() => setShowPhotos(false)}>X</button>
      </div>

      <ul className={styles.list}>
        <li className={styles.photo}>
          <div className={styles.containImage}>
            <img
              src={photosList.length > 0 && photosList[indexSelected].url}
            ></img>
          </div>
          {photosList[indexSelected].author && (
            <div className={styles.author}>
              <b>Autor:</b>
              <img src={photosList[indexSelected].author.photoUri}></img>
              <a href={photosList[indexSelected].author.uri}>
                {photosList[indexSelected].author.displayName}
              </a>
            </div>
          )}
        </li>
      </ul>

      <Options photosList={photosList} />
    </div>
  );
};
