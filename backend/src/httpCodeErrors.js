export const getCodeHttpError = (state) => {
  switch (state) {
    case 1:
      return 400;
    case 2:
      return 404;
    case 3:
      return 409;
    case 4:
      return 502;
  }
};
