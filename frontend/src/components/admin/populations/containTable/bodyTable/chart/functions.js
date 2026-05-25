import CanvasJSReact from "@canvasjs/react-charts";

const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getDataChart = async (
  nameNeighborhood,
  setErrorChart,
  setUser
) => {
  try {
    const response = await fetch(
      LOCALHOST_BACKEND +
        "/admin/population/datapointsNeighborhoodPopulationsYears/" +
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
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "",
    animationEnabled: true,
    title: {
      text: ""
    },
    axisX: {
      title: "Años",
      titleFontColor: "#2c2c2c",
      titleFontSize: 18,
      labelFontColor: "#2c2c2c",
      labelFontSize: 15,
      lineColor: "#2c2c2c",
      interval: 1
    },
    axisY: {
      title: "Habitantes",
      titleFontColor: "#2c2c2c",
      titleFontSize: 18,
      lineColor: "#2c2c2c",
      labelFontColor: "#2c2c2c",
      labelFontSize: 15,
      tickColor: "#2c2c2c",
      gridThickness: 0,
      interval: 1000
    },
    data: [
      {
        type: "spline",
        markerColor: "rgb(228, 74, 74)",
        lineColor: "rgb(255, 255, 255)",
        xValueFormatString: "Habitantes",
        type: "spline",
        dataPoints: dataChart
      }
    ]
  };

  return options;
};
