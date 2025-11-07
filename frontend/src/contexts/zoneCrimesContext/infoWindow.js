import "./infoWindow.css";
export const getDrawInfoWindow = (data, categoryCrime) => {
  return `<div class="infoWindowPolygon">
        <div class="row">
        <span>${data.name}</span>
        <div style="background:${data.rateColor}"></div>
        </div>
        <p>Denuncias de ${
          categoryCrime +
          " " +
          +(data.quantityCrime == null ? "Sin Datos" : data.quantityCrime)
        }</p>
        </div>`;
};
