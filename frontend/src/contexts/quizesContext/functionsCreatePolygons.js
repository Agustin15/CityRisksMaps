export const getRangeSecureQuiz = (percentage) => {
  switch (true) {
    case percentage >= 80:
      return { color: "#ffffbfff", level: "Seguro" };
    case percentage >= 60 && percentage < 80:
      return { color: "#f1f134ff", level: "Medio seguro" };
    case percentage >= 40 && percentage < 60:
      return { color: " #fa7c06ff", level: "Inseguro" };
    case percentage < 40:
      return { color: "#f73d1cff", level: "Muy inseguro" };
  }
};

const createArrayForPolygons = (
  neighborhoodQuizes,
  neighbordhoodsCoordinates
) => {
  const neighbordhoodsDataForPolygons = [];

  neighbordhoodsCoordinates.forEach((neighborhoodCoordinate) => {
    const neighborhoodQuizFound = neighborhoodQuizes.find(
      (neighborhoodQuiz) =>
        neighborhoodQuiz.name.toLowerCase() ==
        neighborhoodCoordinate.neighborhood.toLowerCase()
    );

    if (neighborhoodQuizFound) {
      let rateColor = "#bbbbbbff";
      let rateLevel = "Sin datos";

      if (neighborhoodQuizFound.total != 0) {
        const range = getRangeSecureQuiz(neighborhoodQuizFound.percentage);
        rateColor = range.color;
        rateLevel = range.level;
      }

      neighbordhoodsDataForPolygons.push({
        coordinates: neighborhoodCoordinate.coordinates,
        name: neighborhoodQuizFound.name,
        total: neighborhoodQuizFound.total,
        percentage: neighborhoodQuizFound.percentage,
        rateColor: rateColor,
        rateLevel: rateLevel,
        type: "quiz"
      });
    }
  });

  return neighbordhoodsDataForPolygons;
};

export const createPolygonsNeighbordhood = (
  nhQuizes,
  neighbordhoodsCoordinates,
  polygons,
  setPolygons,
  map
) => {
  if (polygons.length > 0)
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });

  const polygonsCreated = [];
  const neighbordhoodsDataForPolygons = createArrayForPolygons(
    nhQuizes,
    neighbordhoodsCoordinates
  );

  neighbordhoodsDataForPolygons.forEach((nhData) => {
    const polygon = new google.maps.Polygon({
      paths: nhData.coordinates,
      strokeColor: "#8d8d8dff",
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: nhData.rateColor,
      fillOpacity: 0.4,
      clickable: false,
      data: nhData
    });
    polygon.setMap(map);

    polygonsCreated.push(polygon);
  });

  setPolygons(polygonsCreated);
};
