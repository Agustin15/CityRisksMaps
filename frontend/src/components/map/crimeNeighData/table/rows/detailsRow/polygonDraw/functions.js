export const drawShape = (neighborhoodCoordinates, canvas, ctx, rateColor) => {
  const cartesiansPoints = createCartesiansPoints(
    neighborhoodCoordinates,
    canvas
  );

  const axisX = cartesiansPoints.map((cartesianPoint) => cartesianPoint.x);
  const axisY = cartesiansPoints.map((cartesianPoint) => cartesianPoint.y);

  const Xmax = Math.max(...axisX);
  const Xmin = Math.min(...axisX);
  const Ymax = Math.max(...axisY);
  const Ymin = Math.min(...axisY);

  const scaleX = canvas.width / (Xmax - Xmin);
  const scaleY = canvas.height / (Ymax - Ymin);

  ctx.beginPath();
  ctx.fillStyle = rateColor;
  ctx.moveTo(0, 0);

  cartesiansPoints.forEach((cartesianPoint) => {
    const canvaX = (cartesianPoint.x - Xmin) * scaleX;
    const canvaY = (Ymax - cartesianPoint.y) * scaleY;

    ctx.lineTo(canvaX, canvaY);
  });
  ctx.closePath();

  ctx.stroke();
  ctx.fill();
};

const createCartesiansPoints = (neighborhoodCoordinates, canvas) => {
  //mercator web proyection
  const cardinalsPoints = neighborhoodCoordinates.coordinates.map((coord) => {
    const lngRadianes = coord.lng * (Math.PI / 180);
    const latRadianes = coord.lat * (Math.PI / 180);

    const scaleWidth = (canvas.width * Math.pow(2, 2)) / (2 * Math.PI);
    const scaleHeight = (canvas.height * Math.pow(2, 2)) / (2 * Math.PI);

    const x = scaleWidth * (lngRadianes + Math.PI);

    const y =
      canvas.height -
      scaleHeight *
        (Math.PI - Math.log(Math.tan(Math.PI / 4 + latRadianes / 2)));

    return { x: x, y: y };
  });

  return cardinalsPoints;
};
