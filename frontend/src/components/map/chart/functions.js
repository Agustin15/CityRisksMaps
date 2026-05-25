import CanvasJSReact from "@canvasjs/react-charts";

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
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  return {
    culture: "es",
    animationEnabled: true,
    height: 225,
    backgroundColor: "",
    title: {
      text: `Crecimiento de denuncias de ${categoryCrime}s`,
      fontSize: 14,
      fontFamily: "arial",
      fontWeight: "bold",
      fontColor: "white"
    },

    axisX: {
      title: "Años",
      titleFontColor: "white",
      titleFontSize: 15,
      labelFontColor: "white",
      labelFontSize: 14,
      lineColor: "white",
      interval: 1
    },
    axisY: {
      lineColor: "white",
      labelFontColor: "white",
      tickColor: "white",
      gridColor: "white"
    },
    data: [
      {
        markerColor: "#e04b4bff",
        type: "spline",
        lineColor: "white",
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
