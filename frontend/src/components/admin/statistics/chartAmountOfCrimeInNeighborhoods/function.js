import CanvasJSReact from "@canvasjs/react-charts";

export const loadOptionsColumnChart = (dataChart, crime, yearSelected) => {
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "white",
    animationEnabled: true,
    dataPointWidth: 35,
    theme: "blue",

    axisX: {
      title: "Barrios",
      titleFontSize: 19,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: 13,
      interval: 1,
      gridColor: "#d6d6d6"
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
    axisY2: {
      titleFontColor: "#C0504E",
      lineColor: "#C0504E",
      labelFontColor: "#C0504E",
      tickColor: "#C0504E",
      includeZero: true
    },
    data: [
      {
        type: "column",
        width: 25,
        name: yearSelected.toString(),
        showInLegend: true,
        dataPoints: dataChart.registersFirstYear.map((item) => ({
          label: item.name,
          y: item.amount,
          toolTipContent:
            "{label} " +
            item.year +
            ":" +
            item.amount +
            "" +
            (item.increase !== null
              ? item.increase > 0
                ? "<span style='color:red'> (+" + item.increase + ")</span>"
                : "<span style='color:green'> (" + item.increase + "%)</span>"
              : "")
        }))
      },
      {
        type: "column",
        name: (yearSelected - 1).toString(),
        showInLegend: true,
        width: 25,
        dataPoints: dataChart.registersSecondYear.map((item) => ({
          label: item.name,
          y: item.amount,
          toolTipContent: "{label} " + item.year + ":" + item.amount
        }))
      }
    ]
  };

  return options;
};
