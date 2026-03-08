export const handleEditRoute = (
  map,
  editRoute,
  setEditRoute,
  recalculateRoute
) => {
  if (editRoute) {
    setEditRoute(false);
    google.maps.event.clearListeners(map, "click");
    map.setOptions({ draggableCursor: "auto" });
    return;
  }

  setEditRoute(true);
  map.setOptions({ draggableCursor: "crosshair" });

  map.addListener("click", (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const intermediates = [
      {
        location: {
          latLng: {
            latitude: latitude,
            longitude: longitude
          }
        }
      }
    ];

    recalculateRoute(intermediates);
  });
};
