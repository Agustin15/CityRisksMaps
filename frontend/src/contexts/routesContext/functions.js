export const createDataRoutes = (routes, polygons, map) => {
  const polylines = [];
  const polylinesBackground = [];
  const routesWithNewData = [];

  routes.map((route, index) => {
    const pathRoute = new google.maps.geometry.encoding.decodePath(
      route.polyline.encodedPolyline
    );

    const polygonsRoute = verifyPolygonsBelongToRoute(pathRoute, polygons);
    if (polygonsRoute.length > 0) {
      const distanceRoutePolygons = verifyDistanceRouteInPolygons(
        route,
        polygonsRoute,
        index
      );

      const routeRangesDanger = setDangerRangesToRoute(
        route.distanceMeters,
        distanceRoutePolygons
      );

      route["routeRangesDanger"] = routeRangesDanger;
      routesWithNewData.push(route);
    }
    const polylineBackground = new google.maps.Polyline({
      path: pathRoute,
      strokeWeight: 10,
      strokeOpacity: 1.0,
      strokeColor: "#ffffffff"
    });

    const polylineRoute = new google.maps.Polyline({
      path: pathRoute,
      strokeWeight: 7,
      strokeOpacity: index == 0 ? 1.0 : 0.6,
      strokeColor: "#3b70d3ff",
      zIndex: index == 0 ? 2 : 1
    });
    polylineBackground.setMap(map);
    polylineRoute.setMap(map);

    polylinesBackground.push(polylineBackground);
    polylines.push(polylineRoute);
  });

  return {
    routes: routesWithNewData,
    polylines: polylines,
    polylinesBackground: polylinesBackground
  };
};

export const verifyPolygonsBelongToRoute = (routePath, polygons) => {
  let polygonsOfRoute = [];

  routePath.map((coordinateLatLng) => {
    for (const polygon of polygons) {
      let routeInPolygon = google.maps.geometry.poly.containsLocation(
        coordinateLatLng,
        polygon
      );

      if (
        routeInPolygon == true &&
        !polygonsOfRoute.find((poly) => poly.data.name == polygon.data.name)
      ) {
        polygonsOfRoute.push(polygon);
      }
    }
  });

  return polygonsOfRoute;
};

const verifyDistanceRouteInPolygons = (route, polygonsRoutes) => {
  const coordinatesRouteInPolygons = [];

  for (const polygon of polygonsRoutes) {
    let coordinatesRouteInPolygon = [];

    route.legs[0].steps.forEach((step) => {
      const coordinatesStep = new google.maps.geometry.encoding.decodePath(
        step.polyline.encodedPolyline
      );

      coordinatesStep.forEach((latLng) => {
        let belongToPolygon = google.maps.geometry.poly.containsLocation(
          latLng,
          polygon
        );
        if (belongToPolygon) coordinatesRouteInPolygon.push(latLng);
      });
    });
    coordinatesRouteInPolygons.push({
      polygon: polygon,
      coordinatesRoute: coordinatesRouteInPolygon
    });
  }
  return calculateDistanceBetweenCoords(coordinatesRouteInPolygons);
};

const calculateDistanceBetweenCoords = (coordinatesRouteInPolygons) => {
  const distanceRoutePolygons = coordinatesRouteInPolygons.map(
    (coordinatesRoutePolygon) => {
      return {
        polygon: coordinatesRoutePolygon.polygon,
        distanceRoute: google.maps.geometry.spherical.computeLength(
          coordinatesRoutePolygon.coordinatesRoute
        )
      };
    }
  );
  return distanceRoutePolygons;
};

const setDangerRangesToRoute = (routeDistanceMeters, distanceRoutePolygons) => {
  const ranges = ["Baja", "Media baja", "Alta", "Muy alta"];

  let routeRangesDanger = ranges.map((range) => {
    let amountDistance = 0;

    distanceRoutePolygons.forEach((item) => {
      if (item.polygon.data.rateLevel == range) {
        amountDistance += item.distanceRoute;
      }
    });

    return {
      range: range,
      percentage:
        amountDistance > 0
          ? ((amountDistance * 100) / routeDistanceMeters).toFixed(0)
          : 0
    };
  });
  return routeRangesDanger;
};
