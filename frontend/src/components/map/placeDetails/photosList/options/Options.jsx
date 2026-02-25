import styles from "./Options.module.css";
import next from "../../../../../assets/img/next.png";
import prev from "../../../../../assets/img/prev.png";
import { usePhotosPlace } from "../../../../../contexts/PhotosContext";

export const Options = ({ photosList }) => {
  const { setIndexSelected, indexSelected } = usePhotosPlace();

  return (
    <div className={styles.options}>
      <button
        onClick={() => indexSelected > 0 && setIndexSelected(indexSelected - 1)}
      >
        <img src={prev}></img>
      </button>
      <span>
        {indexSelected + 1}/{photosList.length}
      </span>
      <button
        onClick={() =>
          indexSelected + 1 < photosList.length &&
          setIndexSelected(indexSelected + 1)
        }
      >
        <img src={next}></img>
      </button>
    </div>
  );
};
