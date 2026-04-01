const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getDataChart = async (
  nameNeighborhood,
  setErrorChart,
  setUser
) => {
  try {
    const response = await fetch(
      LOCALHOST_BACKEND +
        "/population/datapointsNeighborhoodPopulationsYears/" +
        nameNeighborhood,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-type": "application/json" }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      } else throw new Error(result.messageError);
    }

    return result;
  } catch (error) {
    setErrorChart(error.message);
  }
};

export const loadOptions = (dataChart) => {
  const options = {
    backgroundColor: "",
    animationEnabled: true,
    title: {
      text: ""
    },
    axisX: {
      title: "Años",
      titleFontColor: "white",
      titleFontSize: 15,
      labelFontColor: "white",
      labelFontSize: 15,
      lineColor: "#ffffff",
      interval: 1
    },
    axisY: {
      title: "Habitantes",
      titleFontColor: "white",
      titleFontSize: 16,
      lineColor: "white",
      labelFontColor: "white",
      labelFontSize: 14,
      tickColor: "white",
      gridThickness: 0,
      interval: 1000,
      labelFormatter: function (e) {
        return e.value;
      }
    },
    data: [
      {
        type: "spline",
        markerColor: "rgb(136, 51, 165)",
        lineColor: "rgb(136, 51, 165)",
        yValueFormatString: "#,###",
        xValueFormatString: "Habitantes",
        type: "spline",
        dataPoints: dataChart
      }
    ]
  };

  return options;
};
