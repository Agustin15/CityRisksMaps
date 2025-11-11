import styles from "./Transports.module.css";
import iconWalk from "../../../../assets/img/walk.png";
import iconCar from "../../../../assets/img/car.png";
import iconCarHover from "../../../../assets/img/carHover.png";
import iconTrain from "../../../../assets/img/train.png";
import iconTrainHover from "../../../../assets/img/trainHover.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";
import iconMotorBikeHover from "../../../../assets/img/motorbikeHover.png";
import iconWalkHover from "../../../../assets/img/walkHover.png";

export const Transports = () => {
  return (
    <ul className={styles.transports}>
      <li>
        <img
          onMouseEnter={(event) => (event.target.src = iconCarHover)}
          onMouseLeave={(event) => (event.target.src = iconCar)}
          src={iconCar}
        ></img>
      </li>
      <li>
        <img
          onMouseEnter={(event) => (event.target.src = iconMotorBikeHover)}
          onMouseLeave={(event) => (event.target.src = iconMotorBike)}
          src={iconMotorBike}
        ></img>
      </li>
      <li>
        <img
          onMouseEnter={(event) => (event.target.src = iconTrainHover)}
          onMouseLeave={(event) => (event.target.src = iconTrain)}
          src={iconTrain}
        ></img>
      </li>
      <li>
        <img
          onMouseEnter={(event) => (event.target.src = iconWalkHover)}
          onMouseLeave={(event) => (event.target.src = iconWalk)}
          src={iconWalk}
        ></img>
      </li>
    </ul>
  );
};
