export const getReferenceByCrime = (categoryCrime) => {
  switch (categoryCrime) {
    case "Asesinato":
      return [
        { range: "0-10", color: "#ffffbfff" },
        { range: "11-22", color: "#f1f134ff" },
        { range: "23-30", color: "#fa7c06ff" },
        { range: "31 Y MAS", color: "#f73d1cff" }
      ];
    case "Hurto":
      return [
        { range: "0-900", color: "#ffffbfff" },
        { range: "901-1800", color: "#f1f134ff" },
        { range: "1801-2890", color: "#fa7c06ff" },
        { range: "2891 Y MAS", color: "#f73d1cff" }
      ];
    case "Rapiña":
      return [
        { range: "0-400", color: "#ffffbfff" },
        { range: "401-900", color: "#f1f134ff" },
        { range: "901-1200", color: "#fa7c06ff" },
        { range: "1201 Y MAS", color: "#f73d1cff" }
      ];
  }
};
