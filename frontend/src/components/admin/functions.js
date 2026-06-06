export const formatDate = (date, withoutHour) => {
  const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;

  const year = date.getFullYear();

  if (!withoutHour)
    return day + "/" + month + "/" + year + " " + hour + ":" + minutes;
  else return day + "/" + month + "/" + year;
};
