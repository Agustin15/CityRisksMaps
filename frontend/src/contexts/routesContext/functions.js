export const createDataRoutes = (routes, polygons, map, option) => {
  const polylines = [];
  const polylinesBackground = [];
  const routesWithNewData = [];

  routes.map((route, index) => {
    const pathRoute = new google.maps.geometry.encoding.decodePath(
      route.polyline.encodedPolyline
    );

    const polygonsRoute = verifyPolygonsBelongToRoute(pathRoute, polygons);
    if (polygonsRoute.length > 0) {
      const coordinatesRoutePolygons = verifyCoordinatesRouteInPolygons(
        route,
        polygonsRoute,
        index
      );

      const routeRangesDanger = setDangerRangesToRoute(
        pathRoute.length,
        coordinatesRoutePolygons,
        option
      );

      route["routeRangesDanger"] = routeRangesDanger;
    }

    routesWithNewData.push(route);

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

const verifyCoordinatesRouteInPolygons = (route, polygonsRoutes) => {
  const coordinatesRouteInPolygons = [];

  const pathLegs = google.maps.geometry.encoding.decodePath(
    route.legs[0].polyline.encodedPolyline
  );

  for (const polygon of polygonsRoutes) {
    let coordinates = [];

    pathLegs.forEach((latLng) => {
      let belongToPolygon = google.maps.geometry.poly.containsLocation(
        latLng,
        polygon
      );

      if (belongToPolygon) {
        coordinates.push(latLng);
      }
    });

    coordinatesRouteInPolygons.push({
      polygon: polygon,
      coordinates: coordinates
    });
  }

  return coordinatesRouteInPolygons;
};

export const setDangerRangesToRoute = (
  coordinatesAmountRoute,
  coordinatesRoutePolygons,
  option
) => {
  const ranges =
    option == "quizes"
      ? [
          { level: "Seguro", rangeValue: 100 },
          { level: "Medio seguro", rangeValue: 50 },
          { level: "Inseguro", rangeValue: 20 },
          { level: "Muy inseguro", rangeValue: 10 },
          { level: "Sin datos" }
        ]
      : [
          { level: "Baja", rangeValue: 100 },
          { level: "Media baja", rangeValue: 50 },
          { level: "Alta", rangeValue: 20 },
          { level: "Muy alta", rangeValue: 10 },
          { level: "Sin datos" }
        ];

  let routeRangesDanger = ranges.map((range) => {
    let amount = coordinatesRoutePolygons.reduce((acc, item) => {
      if (item.polygon.data.rateLevel == range.level) {
        acc += item.coordinates.length;
      }
      return acc;
    }, 0);

    return {
      range: range.level,
      percentage:
        amount > 0 ? ((amount * 100) / coordinatesAmountRoute).toFixed(0) : 0,
      levelRange: range.rangeValue
    };
  });
  return routeRangesDanger;
};
