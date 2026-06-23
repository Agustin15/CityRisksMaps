import CanvasJSReact from "@canvasjs/react-charts";

export const loadOptionsColumnChart = (dataChart, windowWidth) => {
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "white",
    animationEnabled: true,
    dataPointWidth: windowWidth < 650 ? 35 : windowWidth < 1200 ? 45 : 55,
    axisX: {
      title: "Tipo de delito",
      titleFontSize: windowWidth < 1200 ? 18 : 21,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: windowWidth < 650 ? 14 : 16,
      gridColor: "#d6d6d6"
    },
    axisY: {
      title: "Cantidad",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: windowWidth < 1200 ? 18 : 21,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: windowWidth < 650 ? 14 : 16,
      tickColor: "gray",
      gridColor: "#d6d6d6",
      interval: 100
    },
    data: [
      {
        type: "column",
        dataPoints: dataChart.map((item) => ({
          label: item.crime,
          y: item.amount,
          toolTipContent:
            "{label}:" + item.amount + " (" + item.percentege + "%" + ")"
        }))
      }
    ]
  };

  return options;
};
