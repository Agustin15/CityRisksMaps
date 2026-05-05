const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const loadData = async (url, setUser) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json"
      }
    });

    const result = await response.json();
    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      }
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loadOptionsChart = (dataChart, crime) => {
  const options = {
    backgroundColor: "",
    animationEnabled: true,
    axisX: {
      title: "Años",
      titleFontSize: 17,
      titleFontWeight: "bold",
      labelFontColor: "#0f0f0f",
      labelFontSize: 14,
      gridColor: "#d6d6d6",
      interval: 1,
      valueFormatString: "#.###"
    },
    axisY: {
      title: "Denuncias",
      titleFontWeight: "bold",
      labelFontColor: "#030303",
      titleFontSize: 16,
      lineColor: "#383838",
      labelFontColor: "#0f0f0f",
      labelFontSize: 15,
      tickColor: "gray",
      gridColor: "#d6d6d6",
      interval: crime == "Homicidio" ? 10 : 500,
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
