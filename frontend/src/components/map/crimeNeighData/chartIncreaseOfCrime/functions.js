import CanvasJSReact from "@canvasjs/react-charts";

const BACKEND_URL = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getIncreaseOfCrime = async (setError, setLoading, crime) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/neighborhoodCrime/increaseOfCategoryCrimeInYears/${crime}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);
    return result;
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

const yearNotFinished = (year) => {
  return year == new Date().getFullYear() && new Date().getMonth() < 12;
};

export const loadOptionsColumnChart = (dataChart, crime, windowWidth) => {
  CanvasJSReact.CanvasJS.addColorSet("customBlue", ["#2492d1"]);
  CanvasJSReact.CanvasJS.addCultureInfo("es", {
    decimalSeparator: ",",
    digitGroupSeparator: "."
  });

  const options = {
    culture: "es",
    backgroundColor: "white",
    animationEnabled: true,
    colorSet: "customBlue",
    dataPointWidth: windowWidth >= 1200 ? 45 : windowWidth > 650 ? 40 : 28,
    axisX: {
      title: "Años",
      titleFontSize: windowWidth >= 1200 ? 17 : 16,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: windowWidth >= 1200 ? 15 : 14,
      gridColor: "#d6d6d6",
      interval: 1
    },
    axisY: {
      title: "Denuncias",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: windowWidth >= 1200 ? 17 : 16,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: windowWidth >= 1200 ? 15 : 14,
      tickColor: "gray",
      gridColor: "#d6d6d6",
      interval: crime == "Homicidio" ? 5 : 2000
    },
    data: [
      {
        markerColor: "rgb(145, 39, 39)",
        type: "spline",
        lineColor: "#e04b4bff",
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
