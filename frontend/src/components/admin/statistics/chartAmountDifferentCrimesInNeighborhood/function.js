export const loadOptionsColumnChart = (dataChart) => {
  console.log(dataChart);
  const options = {
    backgroundColor: "",
    animationEnabled: true,
    axisX: {
      title: "Tipo de delito",
      titleFontSize: 21,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: 16,
      gridColor: "#d6d6d6",
      valueFormatString: "#.###"
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
      interval: 100,
      labelFormatter: function (e) {
        return e.value;
      }
    },
    data: [
      {
        type: "column",
        yValueFormatString: "#,###",
        xValueFormatString: "#.###",
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
