export const colorReference = (range, crimeSelected) => {
  if (crimeSelected) {
    switch (range) {
      case "Baja":
        return "#ffffbfff";
      case "Media baja":
        return "#f1f134ff";
      case "Alta":
        return "#fa7c06ff";
      case "Muy alta":
        return "#f73d1cff";
      case "Sin datos":
        return "#bbbbbbff";
    }
  } else {
    switch (range) {
      case "Seguro":
        return "#ffffbfff";
      case "Medio seguro":
        return "#f1f134ff";
      case "Inseguro":
        return "#f77963ff";
      case "Muy inseguro":
        return "#f7491eff";
      case "Extramadamente inseguro":
        return "#f7491eff";
      case "Sin datos":
        return "#bbbbbbff";
    }
  }
};
