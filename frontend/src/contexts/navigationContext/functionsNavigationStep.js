export const getUserCurrentStep = (
  routeNavigation,
  userLocation,
  transportSelected
) => {
  let toleranceGrades, indexCurrentStepFound;

  const stepCurrentFound = routeNavigation.legs[0].steps.find((step, index) => {
    const polylineStep = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(
        step.polyline.encodedPolyline
      )
    });

    ///1 grado longitud equivale 111319 metros
    if (
      transportSelected == "Drive" ||
      transportSelected == "Transit" ||
      transportSelected == "Two_wheeler"
    )
      toleranceGrades = 30 / 111319;
    else toleranceGrades = 15 / 111319;

    const userInStep = google.maps.geometry.poly.isLocationOnEdge(
      userLocation,
      polylineStep,
      toleranceGrades
    );

    if (userInStep == true) {
      indexCurrentStepFound = index;
      return step;
    }
  });

  if (!stepCurrentFound) return null;

  return {
    step: stepCurrentFound,
    index: indexCurrentStepFound
  };
};
