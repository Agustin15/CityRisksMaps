const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getDataChart = async (
  neighborhoodCrime,
  setErrorChart,
  setUser
) => {
  try {
    const response = await fetch(
      LOCALHOST_BACKEND +
        "/admin/neighborhoodCrime/categoryCrimeInNeighborhood/" +
        neighborhoodCrime.crime +
        "/" +
        neighborhoodCrime.neighborhood,
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

export const loadOptions = (dataChart, crime) => {
  const options = {
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
      interval: 1,
      valueFormatString: "#.###"
    },
    axisY: {
      title: "Denuncias",
      titleFontColor: "#2c2c2c",
      titleFontSize: 18,
      lineColor: "#2c2c2c",
      labelFontColor: "#2c2c2c",
      labelFontSize: 15,
      tickColor: "#2c2c2c",
      gridThickness: 0,
      interval: crime == "Homicidio" ? 10 : 500,
      labelFormatter: function (e) {
        return e.value;
      }
    },
    data: [
      {
        type: "spline",
        markerColor: "rgb(190, 39, 39)",
        lineColor: "rgb(218, 58, 58)",
        yValueFormatString: "#,###",
        xValueFormatString: "#.###",
        type: "spline",
        dataPoints: dataChart.map((item) => ({
          x: item.year,
          y: item.quantity,
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
