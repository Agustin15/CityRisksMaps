const getInterpolatedPointsFromStep = (step, fractionSegments) => {
  let interpolatedPoints = [];

  const startLocation = {
    lat: step.startLocation.latLng.latitude,
    lng: step.startLocation.latLng.longitude
  };

  const endLocation = {
    lat: step.endLocation.latLng.latitude,
    lng: step.endLocation.latLng.longitude
  };

  for (let fraction = 0.01; fraction < fractionSegments; fraction += 0.01) {
    const interpolatedPoint = google.maps.geometry.spherical.interpolate(
      startLocation,
      endLocation,
      fraction
    );
    interpolatedPoints.push(interpolatedPoint);
  }

  return interpolatedPoints;
};

export const getUserCurrentStep = (routeNavigation, userLocation) => {
  const steps = routeNavigation.legs[0].steps;

  const stepsAndDistanceToUser = steps.map((step, index) => {
    const interpolatedPoints = getInterpolatedPointsFromStep(step, 9);

    let prevDistance = google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      interpolatedPoints[0]
    );

    for (let i = 1; i < interpolatedPoints.length; i++) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        userLocation,
        interpolatedPoints[i]
      );

      if (distance < prevDistance) prevDistance = distance;
    }

    return {
      step: step,
      index: index,
      distanceMostClosestToUser: prevDistance
    };
  });

  const stepCurrentFound = stepsAndDistanceToUser.reduce((prev, current) =>
    current.distanceMostClosestToUser < prev.distanceMostClosestToUser
      ? current
      : prev
  );

  if (!stepCurrentFound) return null;

  return {
    step: stepCurrentFound.step,
    index: stepCurrentFound.index
  };
};

export const getNextCoordinatesToUserLocation = (path, userLocation, map) => {
  let nextCoordinates = path.filter((latLng) => {
    const heading = google.maps.geometry.spherical.computeHeading(
      userLocation,
      latLng
    );

    let diff = heading - map.getHeading();
    diff = ((diff + 540) % 360) - 180;
    diff = Math.abs(diff);

    if ((diff >= 0 && diff <= 90) || diff.toFixed() == 360) {
      return latLng;
    }
  });

  return nextCoordinates;
};

export const coordinateMostCloseToUserLocation = (
  nextCoordinates,
  userLocation
) => {
  let prevDistance = google.maps.geometry.spherical.computeDistanceBetween(
    userLocation,
    nextCoordinates[0]
  );

  let latLngMostCloseToUserLocation = nextCoordinates[0];

  for (let i = 1; i < nextCoordinates.length; i++) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      nextCoordinates[i]
    );

    if (distance < prevDistance) {
      prevDistance = distance;
      latLngMostCloseToUserLocation = nextCoordinates[i];
    }
  }

  return latLngMostCloseToUserLocation;
};
