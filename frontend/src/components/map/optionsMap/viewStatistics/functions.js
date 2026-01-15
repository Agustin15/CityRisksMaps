const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getCrimes = async (setLoadingCrimes, setErrorQuery) => {
  let optionGET = JSON.stringify({ option: "getCrimes" });

  setLoadingCrimes(true);
  try {
    const response = await fetch(localhostBackend + "/crimes/" + optionGET, {
      method: "GET",
      headers: { "Content-type": "application/json" }
    });

    const result = await response.json();
    if (!response.ok) throw result.messageError;

    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error.message);
    setErrorQuery(error);
    console.log(error);
  } finally {
    setLoadingCrimes(false);
  }
};
