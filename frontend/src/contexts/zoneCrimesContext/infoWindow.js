import "./infoWindow.css";
export const getDrawInfoWindow = (data, categoryCrime) => {
  return `<div class="infoWindowPolygon">
        <div class="row">
        <span>${data.name}</span>
        <div style="background:${data.rateColor}"></div>
        </div>
        <p>Tasa de ${categoryCrime + "s:" + (data.rate?data.rate:"Sin datos")}</p>
        </div>`;
};
