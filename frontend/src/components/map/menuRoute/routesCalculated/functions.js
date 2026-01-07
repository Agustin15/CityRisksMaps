export const convertDuration = (duration) => {
  let converted;
  switch (true) {
    //segundos
    //minutos
    case duration >= 60 && duration < 3600: {
      converted = (duration / 60).toFixed(0);
      return converted + (converted > 1 ? " minutos" : " minuto");
    }
    //horas
    case duration >= 3600 && duration < 86400:
      converted = (duration / 3600).toFixed(0);
      return converted + (converted > 1 ? " horas" : " hora");
    //dias
    case duration >= 86400:
      converted = (duration / 86400).toFixed(0);
      return converted + (converted > 1 ? " dias" : " dia");

    //segundos
    default: {
      return duration + (duration > 1 ? " segundos" : " segundo");
    }
  }
};

export const convertDistance = (distance) => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(1) + (distance > 1 ? " kms" : " km");
  } else return distance + (distance > 1 ? " mts" : " mt");
};

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
