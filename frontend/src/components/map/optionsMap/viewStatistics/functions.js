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

export const resize = (viewStatisticsId) => {
  if (window.innerWidth >= 1200) return;

  const viewStatistics = document.getElementById(viewStatisticsId);

  if (!viewStatistics) return;

  viewStatistics.removeAttribute("style");
  const containOption = viewStatistics.firstChild;

  if (containOption) {
    resizeAction(viewStatistics, containOption);
  }

  removeEventListener("touchmove", resizeAction);
  return;
};

const resizeAction = (viewStatistics, containOption) => {
  containOption.addEventListener("touchmove", (event) => {
    switch (true) {
      case window.innerWidth <= 650:
        const toucheYvh =
          (event.targetTouches[0].pageY * 100) / window.innerHeight;

        if (toucheYvh >= 0 && toucheYvh < 86)
          viewStatistics.style.transform = `TranslateY(${toucheYvh}vh)`;
        break;

      case window.innerWidth > 650 && window.innerWidth < 1200:
        const toucheYvw =
          (event.targetTouches[0].pageX * 100) / window.innerWidth;

        if (toucheYvw > 14 && toucheYvw < 93)
          viewStatistics.style.right = `${100 - toucheYvw}vw`;
        break;
    }
  });
};
