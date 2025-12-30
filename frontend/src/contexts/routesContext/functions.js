export const createDataRoutes = (routes, polygons, map) => {
  const polylines = [];

  routes.map((route) => {
    const pathRoute = new google.maps.geometry.encoding.decodePath(
      route.polyline.encodedPolyline
    );

    verifyDangerousnessRoute(pathRoute, polygons);
    const polylineRoute = new google.maps.Polyline({
      path: pathRoute,
      strokeWeight: 7,
      strokeColor: "#5682d4ff"
    });
    polylineRoute.setMap(map);

    polylines.push(polylineRoute);
  });

  return { routes: routes, polylines: polylines };
};

const verifyDangerousnessRoute = (routePath, polygons) => {
  const polygonsOfRoutes = [];

  routePath.forEach((coordinateLatLng) => {
    for (const polygon of polygons) {
      let routeInPolygon = google.maps.geometry.poly.containsLocation(
        coordinateLatLng,
        polygon
      );

      if (routeInPolygon == true) polygonsOfRoutes.push(polygon);
    }
  });

  const ranges = ["Baja", "Media Baja", "Alta", "Muy Alta"];

  let routeRangesDanger = ranges.map((range) => {
    const amount = polygonsOfRoutes.reduce((acc, polygon) => {
      if (polygon.data.rateLevel == range) acc++;
      return acc;
    }, 0);

    return {
      range: range,
      percentage: amount > 0 ? (amount * 100) / polygonsOfRoutes.length : 0
    };
  });

  console.log(routeRangesDanger);
};
