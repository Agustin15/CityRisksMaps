const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getCrimesQuizNeighborhood = async (
  neighborhood,
  yearSelected,
  setErrorQuery,
  setCrimesNeighborhood
) => {
  const optionGet = JSON.stringify({
    option: "getCrimesOfNeighborhoodQuizes",
    neighborhood: neighborhood,
    year: yearSelected
  });

  try {
    const response = await fetch(localhostBackend + "/quiz/" + optionGet, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);
    if (result) setCrimesNeighborhood(result);
  } catch (error) {
    console.log(error.message);
    setErrorQuery(error.message);
  }
};

export const calculatePercentage = (
  crimesNeighborhood,
  amountCategoryCrime
) => {
  const amountCategoryCrimes = crimesNeighborhood.reduce(
    (acc, crimeNeighborhood) => (acc += crimeNeighborhood.amount),
    0
  );

  const percentege = (amountCategoryCrime * 100) / amountCategoryCrimes;

  return percentege.toFixed(1);
};
