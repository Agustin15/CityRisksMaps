export const createDataRoutes = (routes, polygons, map, option) => {
  const polylines = [];
  const polylinesBackground = [];
  const routesWithNewData = [];

  routes.map((route, index) => {
    const pathRoute = new google.maps.geometry.encoding.decodePath(
      route.polyline.encodedPolyline
    );

    const coordinatesRouteInPolygons = verifyCoordinatesRouteInPolygons(
      pathRoute,
      polygons
    );
    if (coordinatesRouteInPolygons.length > 0) {
      const routeRangesDanger = setDangerRangesToRoute(
        pathRoute.length,
        coordinatesRouteInPolygons,
        option
      );

      route["routeRangesDanger"] = routeRangesDanger;
    }

    routesWithNewData.push(route);

    const polylineRoute = new google.maps.Polyline({
      path: pathRoute,
      strokeWeight: 7,
      strokeOpacity: index == 0 ? 1.0 : 0.6,
      strokeColor: "#3b70d3ff",
      zIndex: index == 0 ? 2 : 1
    });

    polylineRoute.setMap(map);

    polylines.push(polylineRoute);
  });
  return {
    routes: routesWithNewData,
    polylines: polylines
  };
};

export const verifyCoordinatesRouteInPolygons = (routePath, polygons) => {
  const coordinatesRouteInPolygons = [];

  for (const polygon of polygons) {
    const coordinatesBelong = routePath.filter((coordinateLatLng) => {
      let coordinateInPolygon = google.maps.geometry.poly.containsLocation(
        coordinateLatLng,
        polygon
      );

      if (coordinateInPolygon == true) return coordinateLatLng;
    });

    if (coordinatesBelong.length > 0) {
      coordinatesRouteInPolygons.push({
        polygon: polygon,
        coordinates: coordinatesBelong
      });
    }
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
