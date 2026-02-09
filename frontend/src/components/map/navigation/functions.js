import iconTurnLeft from "../../../assets/img/turnLeft.png";
import iconTurnRight from "../../../assets/img/turnRight.png";
import iconDepart from "../../../assets/img/depart.png";

export const verifyUserLocationInPolygon = (
  userLocation,
  polygons,
  setWarning,
  warning
) => {
  const polygonFound = polygons.find((polygon) => {
    if (google.maps.geometry.poly.containsLocation(userLocation, polygon))
      return polygon;
  });

  if (!polygonFound) {
    setWarning({ rateLevel: "", rateColor: "", type: "", neighborhood: "" });
  } else if (warning.rateLevel != polygonFound.data.rateLevel) {
    setWarning({
      ...warning,
      rateLevel: polygonFound.data.rateLevel,
      rateColor: polygonFound.data.rateColor,
      type: polygonFound.data.type,
      neighborhood: polygonFound.data.name
    });
  }
};

export const getImageManeuver = (maneuver) => {
  switch (maneuver) {
    case "TURN_LEFT":
      return iconTurnLeft;
    case "TURN_RIGHT":
      return iconTurnRight;
    case "TURN_RIGHT":
      return iconTurnRight;
    case "DEPART":
      return iconDepart;
  }
};
