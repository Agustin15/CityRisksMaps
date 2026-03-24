const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getDataChart = async (
  categoryCrime,
  idNeighborhood,
  setErrorDataChart
) => {
  let optionGET = JSON.stringify({
    option: "getCategoryCrimeInNeighborhood",
    idNeighborhood: idNeighborhood,
    categoryCrime: categoryCrime
  });

  try {
    const response = await fetch(
      localhostBackend + "/neighborhoodCrime/" + optionGET,
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
      lineColor: "white",
      interval: 1
    },
    axisY: {
      lineColor: "white",
      labelFontColor: "white",
      tickColor: "white",
      gridColor: "white",
      labelFormatter: function (e) {
        return categoryCrime ? e.value : e.value + "%";
      }
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
              y: neighborhoodCrime.quantity
            };
          })
      }
    ]
  };
};
