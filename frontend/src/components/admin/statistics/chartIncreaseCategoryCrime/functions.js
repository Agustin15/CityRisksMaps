export const loadOptionsLineChart = (
  dataChart,
  crime,
  intervalOne,
  intervalTwo
) => {
  const options = {
    backgroundColor: "",
    animationEnabled: true,
    axisX: {
      title: "Años",
      titleFontSize: 21,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: 16,
      gridColor: "#d6d6d6",
      interval: 1,
      valueFormatString: "#.###"
    },
    axisY: {
      title: "Denuncias",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: 21,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: 16,
      tickColor: "gray",
      gridColor: "#d6d6d6",
      interval: crime == "Homicidio" ? intervalOne : intervalTwo,
      labelFormatter: function (e) {
        return e.value;
      }
    },
    data: [
      {
        type: "spline",
        markerColor: "rgb(228, 74, 74)",
        lineColor: "rgb(36, 105, 209)",
        yValueFormatString: "#,###",
        xValueFormatString: "#.###",
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
