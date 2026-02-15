
export const changeRoute = (routeSelected, polylines, setPolylines) => {
  const polylinesUpdated = polylines.map((polyline, index) => {
    if (index == routeSelected) {
      polyline.setOptions({ strokeOpacity: 1.0, zIndex: 2 });
    } else {
      polyline.setOptions({ strokeOpacity: 0.6, zIndex: 1 });
    }
    return polyline;
  });

  setPolylines(polylinesUpdated);
};
