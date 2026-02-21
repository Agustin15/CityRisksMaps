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
  } else if (warning.neighborhood != polygonFound.data.name) {
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

const getCoordOfStepMostClosestToUser = (pathStep, userLocation) => {
  let indexLatLng = 0;
  let latLngMostClosest = pathStep[0];
  let prevDistanceMostClosest =
    google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      pathStep[0]
    );

  pathStep.forEach((latLng, index) => {
    if (index == 0) return;

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      latLng
    );
    if (distance < prevDistanceMostClosest) {
      prevDistanceMostClosest = distance;
      latLngMostClosest = latLng;
      indexLatLng = index;
    }
  });

  return { latLngMostClosest: latLngMostClosest, indexLatLng: indexLatLng };
};

export const verifyUserDistanceToCurrentStep = (
  step,
  userLocation,
  transport
) => {
  let toleranceMeters;

  const pathStep = google.maps.geometry.encoding.decodePath(
    step.polyline.encodedPolyline
  );

  let detailsOfLatLngMostClosest = getCoordOfStepMostClosestToUser(
    pathStep,
    userLocation
  );

  const distanceBetweenCoordAndUser =
    google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      detailsOfLatLngMostClosest.latLngMostClosest
    );

  if (
    transport == "Drive" ||
    transport == "Transit" ||
    transport == "Two_wheeler"
  ) {
    toleranceMeters = 30;
  } else {
    toleranceMeters = 15;
  }

  if (distanceBetweenCoordAndUser >= toleranceMeters) {
    return null;
  } else {
    return detailsOfLatLngMostClosest.indexLatLng;
  }
};

export const activateNavigationVoice = (text) => {
  const synth = window.speechSynthesis;

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = synth.getVoices()[4];
  utterance.lang = "es-MX";
  utterance.volume = 0.5;

  synth.speak(utterance);
};

export const handleOptionVoice = (
  activeNavigationVoice,
  setActiveNavigationVoice,
  currentStep
) => {
  if (!activeNavigationVoice) {
    setActiveNavigationVoice(true);
    activateNavigationVoice(currentStep.navigationInstruction.instructions);
  } else setActiveNavigationVoice(false);
};
