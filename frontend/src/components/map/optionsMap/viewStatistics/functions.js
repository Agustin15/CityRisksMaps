const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getCrimes = async (loadingMenu, setLoadingMenu, setErrorLoad) => {

  if (!loadingMenu) setLoadingMenu(true);

  try {
    const response = await fetch(localhostBackend + "/crime/crimes", {
      method: "GET",
      headers: { "Content-type": "application/json" }
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.messageError);

    if (result) {
      return result;
    }
  } catch (error) {
    setErrorLoad(error.message);
  } finally {
    setLoadingMenu(false);
  }
};
