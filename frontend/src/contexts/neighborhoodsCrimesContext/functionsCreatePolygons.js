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
    {
      rate: rate >= ranges[6],
      color: "#f73d1cff",
      level: "Muy alta"
    }
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

export const createPolygonsNeighbordhood = (
  neighborhoodsCrime,
  categoryCrime,
  neighborhoodsCoordinates
) => {
  let colorRange = null;
  let levelRange = null;

  const polygons = neighborhoodsCrime.map((neighborhoodCrime) => {
    if (neighborhoodCrime.rate != null) {
      const range = getCrimeRange(
        neighborhoodCrime.rate.toFixed(0),
        categoryCrime
      );
      colorRange = range.color;
      levelRange = range.level;
    }

    const neighborhoodFound = neighborhoodsCoordinates.find(
      (hoodCoordinate) => hoodCoordinate.neighborhood == neighborhoodCrime.name
    );

    const polygon = new google.maps.Polygon({
      paths: neighborhoodFound.coordinates,
      strokeColor: "#8d8d8dff",
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: colorRange,
      fillOpacity: 0.4,
      clickable: false,
      data: {
        name: neighborhoodCrime.name,
        population: neighborhoodCrime.quantityPopulation,
        quantityCrime: neighborhoodCrime.quantityCrime,
        rate: neighborhoodCrime.rate,
        rateLevel: levelRange ? levelRange : "Sin datos",
        rateColor: colorRange ? colorRange : "#bbbbbbff",
        categoryCrime: categoryCrime,
        coordinates: neighborhoodFound.coordinates
      }
    });

    return polygon;
  });

  return polygons;
};

