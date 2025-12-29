export const convertDuration = (duration) => {
  switch (true) {
    //minutos
    case duration >= 60 && duration < 3600: {
      return (
        (duration / 60).toFixed(0) + (duration > 1 ? " minutos" : " minuto")
      );
    }
    //horas
    case duration >= 3600 && duration < 86400:
      return (duration / 3600).toFixed(0) + (duration > 1 ? " horas" : " hora");
    //dias
    case duration >= 86400:
      return (duration / 86400).toFixed(0) + (duration > 1 ? " dias" : " dia");
  }
};

export const convertDistance = (distance) => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(1) + (distance > 1 ? " kms" : " km");
  } else return distance + (distance > 1 ? " mt" : " mts");
};
