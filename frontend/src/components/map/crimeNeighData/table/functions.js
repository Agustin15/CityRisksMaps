export const calculateAmountCrime = (neighborhoodsCrimeByYear) => {
  const amount = neighborhoodsCrimeByYear.reduce((acc, neighborhoodsCrime) => {
    if (neighborhoodsCrime.quantityCrime != null) {
      acc += neighborhoodsCrime.quantityCrime;
    }
    return acc;
  }, 0);
  return amount;
};

export const calculateAmountRate = (neighborhoodsCrimeByYear) => {
  let index = 0;
  const amountRate = neighborhoodsCrimeByYear.reduce(
    (acc, neighborhoodCrime) => {
      if (neighborhoodCrime.rate != null) {
        acc += neighborhoodCrime.rate;
        index++;
      }
      return acc;
    },
    0
  );

  return amountRate / index;
};
