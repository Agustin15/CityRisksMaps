import styles from "./Photo.module.css";
import imageNotFound from "../../../../assets/img/imageNotFound.png";

export const Photo = ({ place }) => {
  return (
    <div className={styles.containPhoto}>
      {(!place.photosList || place.photosList.length) == 0 ? (
        <img className={styles.imageNotFound} src={imageNotFound}></img>
      ) : (
        <img src={place.photosList[0].url}></img>
      )}
    </div>
  );
};
