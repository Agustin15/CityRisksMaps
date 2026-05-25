import CanvasJSReact from "@canvasjs/react-charts";

export const loadOptionsColumnChart = (dataChart) => {
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "",
    animationEnabled: true,
    dataPointWidth: 65,
    axisX: {
      title: "Tipo de delito",
      titleFontSize: 21,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: 16,
      gridColor: "#d6d6d6"
    },
    axisY: {
      title: "Cantidad",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: 21,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: 16,
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
