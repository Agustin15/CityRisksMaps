export const handleMouseNeighborhoohdPolygon = (
  event,
  polygons,
  setPolygonSelected
) => {
  let polygonFound = null;
  if (polygons) {
    for (const polygon of polygons) {
      if (
        google.maps.geometry.poly.containsLocation(event.detail.latLng, polygon)
      ) {
        polygonFound = polygon;
        polygonFound.data.center = getPolygonCenter(
          polygonFound.data.coordinates
        );
        break;
      }
    }
  }

  if (polygonFound) {
    setPolygonSelected({
      data: polygonFound.data,
      mouse: {
        offsetX: event.domEvent.offsetX,
        offsetY: event.domEvent.offsetY
      }
    });
  } else setPolygonSelected();
};

const getPolygonCenter = (polygonCoordinates) => {
  const bounds = new google.maps.LatLngBounds();

  polygonCoordinates.forEach((coordinate) => {
    bounds.extend(coordinate);
  });

  return bounds.getCenter();
};
