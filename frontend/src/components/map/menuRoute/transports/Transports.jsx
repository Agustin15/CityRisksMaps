import styles from "./Transports.module.css";
import iconWalk from "../../../../assets/img/walk.png";
import iconCar from "../../../../assets/img/car.png";
import iconTrain from "../../../../assets/img/train.png";
import iconMotorBike from "../../../../assets/img/motorbike.png";

export const Transports = () => {
  return (
    <ul className={styles.transports}>
      <li>
        <img src={iconCar}></img>
      </li>
      <li>
        <img src={iconMotorBike}></img>
      </li>
      <li>
        <img src={iconTrain}></img>
      </li>
      <li>
        <img src={iconWalk}></img>
      </li>
    </ul>
  );
};
