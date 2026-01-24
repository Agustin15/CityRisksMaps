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

export const resize = (windowWidth, windowHeight) => {
  removeEventListener("touchmove", resizeAction);

  const viewStatistics = document.getElementById("viewStatistics");

  if (viewStatistics) {
    viewStatistics.removeAttribute("style");
    const containOptionsCrimes = viewStatistics.firstChild;

    if (containOptionsCrimes) {
      containOptionsCrimes.addEventListener("touchmove", (event) =>
        resizeAction(event, windowWidth, windowHeight, viewStatistics)
      );
    }
  }
};

const resizeAction = (event, windowWidth, windowHeight, viewStatistics) => {
  switch (true) {
    case windowWidth <= 650:
      const toucheYvh = (event.targetTouches[0].pageY * 100) / windowHeight;

      if (toucheYvh >= 0 && toucheYvh < 86)
        viewStatistics.style.transform = `TranslateY(${toucheYvh}vh)`;
      break;

    case windowWidth > 650 && windowWidth < 1200:
      const toucheYvw = (event.targetTouches[0].pageX * 100) / windowWidth;

      if (toucheYvw > 14 && toucheYvw < 92.3)
        viewStatistics.style.right = `${100 - toucheYvw}vw`;
      break;
  }
};
