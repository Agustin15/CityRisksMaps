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
    case "Asesinato":
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
  const nhCrimeCoordinates = [];
  for (let nhCrime of neighbordhoodsCrime) {
    neighbordhoodsCoordinates.map((nhCoordinate) => {
      if (
        nhCoordinate.neighborhood.toLowerCase() == nhCrime.name.toLowerCase()
      ) {
        const rate =
          nhCrime.quantityCrime == null
            ? null
            : defineCrimeRate(
                nhCrime.quantityCrime,
                nhCrime.quantityPopulation
              );

        const colorRange =
          rate == null ? null : getCrimeRange(rate, categoryCrime).color;

        nhCrimeCoordinates.push({
          name: nhCrime.name,
          quantityCrime: nhCrime.quantityCrime,
          rate: rate,
          rateColor: colorRange ? colorRange : "#bbbbbbff",
          categoryCrime: categoryCrime,
          coordinates: nhCoordinate.coordinates,
          type: "crime"
        });
      }
    });
  }
  return nhCrimeCoordinates;
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

  const nhCrimeCoordinates = createArrayForPolygons(
    neighbordhoodsCrime,
    categoryCrime,
    neighbordhoodsCoordinates
  );

  nhCrimeCoordinates.forEach((nhCrimeCoordinate) => {
    const polygon = new google.maps.Polygon({
      paths: nhCrimeCoordinate.coordinates,
      strokeColor: "#8d8d8dff",
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: nhCrimeCoordinate.rateColor,
      fillOpacity: 0.4,
      clickable: false,
      data: nhCrimeCoordinate
    });
    polygon.setMap(map);

    polygons.push(polygon);
  });

  setPolygons(polygons);
};
