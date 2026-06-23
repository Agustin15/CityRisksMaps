import CanvasJSReact from "@canvasjs/react-charts";

export const loadOptionsLineChart = (
  dataChart,
  crime,
  intervalOne,
  intervalTwo,
  windowWidth
) => {
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "",
    animationEnabled: true,
    axisX: {
      title: "Años",
      titleFontSize: windowWidth < 650 ? 17 : 21,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: windowWidth < 650 ? 14 : 16,
      gridColor: "#d6d6d6",
      interval: 1
    },
    axisY: {
      title: "Denuncias",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: windowWidth < 650 ? 17 : 21,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: windowWidth < 650 ? 14 : 16,
      tickColor: "gray",
      gridColor: "#d6d6d6",
      interval: crime == "Homicidio" ? intervalOne : intervalTwo
    },
    data: [
      {
        type: "spline",
        markerColor: "rgb(202, 47, 47)",
        lineColor: "rgb(206, 38, 38)",
        type: "spline",
        dataPoints: dataChart.map((item) => ({
          x: item.year,
          y: item.amount,
          toolTipContent:
            "Denuncias {x}:{y}" +
            (item.increase !== null
              ? item.increase > 0
                ? "<span style='color:red'> (+" + item.increase + ")</span>"
                : "<span style='color:green'> (" + item.increase + "%)</span>"
              : "")
        }))
      }
    ]
  };

  return options;
};
