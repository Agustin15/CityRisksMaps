import iconTurnRight from "../../../assets/img/turnRight.png";
import iconTurnLeft from "../../../assets/img/turnLeft.png";
import iconDepart from "../../../assets/img/depart.png";

export const getImageManeuver = (maneuver) => {
  switch (maneuver) {
    case "TURN_LEFT":
      return iconTurnLeft;
    case "TURN_RIGHT":
      return iconTurnRight;
    case "DEPART":
      return iconDepart;
  }
};
