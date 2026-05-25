import CanvasJSReact from "@canvasjs/react-charts";

export const loadOptionsColumnChart = (dataChart, crime) => {
  CanvasJSReact.CanvasJS.addColorSet("blue", ["#20599b"]);
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "",
    colorSet: "blue",
    animationEnabled: true,
    dataPointWidth: 35,
    theme: "blue",
    axisX: {
      title: "Barrios",
      titleFontSize: 19,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: 10,
      interval: 1,
      gridColor: "#d6d6d6",
    },
    axisY: {
      title: "Cantidad de denuncias",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: 18,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: 15,
      tickColor: "gray",
      gridColor: "#d6d6d6",
      interval: crime == "Homicidio" ? 3 : crime == "Hurto" ? 200 : 50
    },
    data: [
      {
        type: "column",
        width: 25,
        dataPoints: dataChart.map((item) => ({
          label: item.name,
          y: item.amount,
          toolTipContent: "{label}:" + "(" + item.amount + ")"
        }))
      }
    ]
  };

  return options;
};
