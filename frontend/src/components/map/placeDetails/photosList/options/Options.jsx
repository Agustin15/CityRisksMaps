import styles from "./Options.module.css";
import next from "../../../../../assets/img/next.png";
import prev from "../../../../../assets/img/prev.png";

export const Options = ({ setIndex, index, photosDetails }) => {
  return (
    <div className={styles.options}>
      <button onClick={() => index > 0 && setIndex(index - 1)}>
        <img src={prev}></img>
      </button>
      <span>
        {index + 1}/{photosDetails.length}
      </span>
      <button
        onClick={() => index + 1 < photosDetails.length && setIndex(index + 1)}
      >
        <img src={next}></img>
      </button>
    </div>
  );
};
