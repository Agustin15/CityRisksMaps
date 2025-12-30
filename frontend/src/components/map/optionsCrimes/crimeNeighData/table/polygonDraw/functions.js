export const drawShape = (neighborhoodCoordinates, canvas, ctx, rateColor) => {
  
  const cardinalsPoints = createCartesiansPoints(
    neighborhoodCoordinates,
    canvas
  );

  const axisX = cardinalsPoints.map((cardinalsPoint) => cardinalsPoint.x);
  const axisY = cardinalsPoints.map((cardinalsPoint) => cardinalsPoint.y);

  const Xmax = Math.max(...axisX);
  const Xmin = Math.min(...axisX);
  const Ymax = Math.max(...axisY);
  const Ymin = Math.min(...axisY);

  const scaleX = canvas.width / (Xmax - Xmin);
  const scaleY = canvas.height / (Ymax - Ymin);

  ctx.beginPath();
  ctx.fillStyle = rateColor;
  ctx.moveTo(0, 0);

  cardinalsPoints.forEach((cardinalsPoint) => {
    const pixelX = (cardinalsPoint.x - Xmin) * scaleX;
    const pixelY = (Ymax - cardinalsPoint.y) * scaleY;

    ctx.lineTo(pixelX, pixelY);
  });
  ctx.closePath();

  ctx.stroke();
  ctx.fill();
};

const createCartesiansPoints = (neighborhoodCoordinates, canvas) => {
  //mercator proyection
  const cardinalsPoints = neighborhoodCoordinates.coordinates.map((coord) => {
    const lngRadianes = coord.lng * (Math.PI / 180);
    const latRadianes = coord.lat * (Math.PI / 180);

    const x = (canvas.width / (2 * Math.PI)) * (lngRadianes + Math.PI);

    const y =
      canvas.height -
      (canvas.height / (2 * Math.PI)) *
        (Math.PI - Math.log(Math.tan(Math.PI / 4 + latRadianes / 2)));

    return { x: x, y: y };
  });

  return cardinalsPoints;
};
