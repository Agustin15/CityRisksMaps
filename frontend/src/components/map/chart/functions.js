const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getDataChart = async (
  categoryCrime,
  idNeighborhood,
  setErrorDataChart
) => {
  try {
    const response = await fetch(
      localhostBackend +
        "/neighborhoodCrime/categoryCrimeInNeighborhood/" +
        categoryCrime +
        "/" +
        idNeighborhood,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-type": "application/json" }
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);
    return result;
  } catch (error) {
    setErrorDataChart(error.message);
  }
};

export const setOptionsChart = (dataChart, categoryCrime) => {
  return {
    backgroundColor: "",
    title: {
      text: `Crecimiento de denuncias de ${categoryCrime}s`,
      fontSize: 14,
      fontFamily: "arial",
      fontWeight: "bold",
      fontColor: "white"
    },
    height: 225,
    animationEnabled: true,
    axisX: {
      title: "Años",
      titleFontColor: "white",
      titleFontSize: 15,
      labelFontColor: "white",
      labelFontSize: 14,
      lineColor: "white",
      valueFormatString: "#.###",
      interval: 1
    },
    axisY: {
      lineColor: "white",
      labelFontColor: "white",
      tickColor: "white",
      gridColor: "white",
      valueFormatString: "#,###"
    },
    data: [
      {
        markerColor: "#e04b4bff",
        type: "spline",
        lineColor: "white",
        yValueFormatString: "#,###",
        dataPoints:
          dataChart &&
          dataChart.map((neighborhoodCrime) => {
            return {
              x: neighborhoodCrime.year,
              y: neighborhoodCrime.quantity,
              toolTipContent:
                "Denuncias {x}:{y}" +
                (neighborhoodCrime.increase !== null
                  ? neighborhoodCrime.increase > 0
                    ? "<span style='color:red'> (+" +
                      neighborhoodCrime.increase +
                      ")</span>"
                    : "<span style='color:green'> (" +
                      neighborhoodCrime.increase +
                      "%)</span>"
                  : "")
            };
          })
      }
    ]
  };
};
