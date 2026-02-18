export const defineCrimeRate = (quantityCrime, quantityPopulation) => {
  return Math.floor((quantityCrime / quantityPopulation) * 100000);
};

export const defineCrimeRange = (rate, ranges) => {
  const crimeRanges = [
    {
      rate: rate >= ranges[0] && rate <= ranges[1],
      color: "#ffffbfff",
      level: "Baja"
    },
    {
      rate: rate >= ranges[2] && rate <= ranges[3],
      color: "#f1f134ff",
      level: "Media baja"
    },
    {
      rate: rate >= ranges[4] && rate <= ranges[5],
      color: "#fa7c06ff",
      level: "Alta"
    },
    { rate: rate >= ranges[6], color: "#f73d1cff", level: "Muy alta" }
  ];

  const crimeRangeFound = crimeRanges.find((item) => item.rate == true);
  if (crimeRangeFound) {
    return crimeRangeFound;
  }
};

export const getCrimeRange = (rate, categoryCrime) => {
  switch (categoryCrime) {
    case "Homicidio":
      return defineCrimeRange(rate, [0, 10, 11, 22, 23, 30, 31]);

    case "Hurto":
      return defineCrimeRange(rate, [0, 900, 901, 1800, 1801, 2890, 2891]);

    case "Rapiña":
      return defineCrimeRange(rate, [0, 400, 401, 900, 901, 1200, 1201]);
  }
};

export const createArrayForPolygons = (
  neighbordhoodsCrime,
  categoryCrime,
  neighbordhoodsCoordinates
) => {
  const neighborhoodsCrimeCoordinates = [];

  for (let nhCrime of neighbordhoodsCrime) {
    neighbordhoodsCoordinates.forEach((nhCoordinate) => {
      if (
        nhCoordinate.neighborhood.toLowerCase() == nhCrime.name.toLowerCase()
      ) {
        let rate = null;
        let colorRange = null;
        let levelRange = null;

        if (nhCrime.quantityCrime != null)
          rate = defineCrimeRate(
            nhCrime.quantityCrime,
            nhCrime.quantityPopulation
          );

        if (rate != null) {
          const range = getCrimeRange(rate, categoryCrime);
          colorRange = range.color;
          levelRange = range.level;
        }

        neighborhoodsCrimeCoordinates.push({
          name: nhCrime.name,
          population: nhCrime.quantityPopulation,
          quantityCrime: nhCrime.quantityCrime,
          rate: rate,
          rateLevel: levelRange ? levelRange : "Sin datos",
          rateColor: colorRange ? colorRange : "#bbbbbbff",
          categoryCrime: categoryCrime,
          coordinates: nhCoordinate.coordinates,
          type: "crime"
        });
      }
    });
  }

  return neighborhoodsCrimeCoordinates;
};

export const createPolygonsNeighbordhood = async (
  neighbordhoodsCrime,
  categoryCrime,
  neighbordhoodsCoordinates,
  map,
  setPolygons
) => {
  const polygons = [];
  map.setZoom(12);

  const neighborhoodsCrimeCoordinates = createArrayForPolygons(
    neighbordhoodsCrime,
    categoryCrime,
    neighbordhoodsCoordinates
  );

  neighborhoodsCrimeCoordinates.forEach((neighborhoodCrimeCoordinates) => {
    const polygon = new google.maps.Polygon({
      paths: neighborhoodCrimeCoordinates.coordinates,
      strokeColor: "#8d8d8dff",
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: neighborhoodCrimeCoordinates.rateColor,
      fillOpacity: 0.4,
      clickable: false,
      data: neighborhoodCrimeCoordinates
    });
    polygon.setMap(map);
    polygons.push(polygon);
  });

  setPolygons(polygons);
};
