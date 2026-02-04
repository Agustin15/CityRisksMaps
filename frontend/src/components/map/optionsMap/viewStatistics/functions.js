const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const getCrimes = async (loadingMenu, setLoadingMenu) => {
  let optionGET = JSON.stringify({ option: "getCrimes" });

  if (!loadingMenu) setLoadingMenu(true);

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
  } finally {
    setLoadingMenu(false);
  }
};

export const resize = (elementId, option) => {
  if (window.innerWidth >= 1200) return;

  const elementToResize = document.getElementById(elementId);

  if (!elementToResize) return;

  elementToResize.removeAttribute("style");

  const containOption = elementToResize.firstChild;

  if (containOption) resizeAction(elementToResize, containOption, option);

  removeEventListener("touchmove", resizeAction);
  return;
};

const resizeAction = (elementToResize, containOption, option) => {
  containOption.addEventListener("touchmove", (event) => {
    switch (true) {
      case window.innerWidth <= 650:
        let toucheYvh =
          (event.targetTouches[0].pageY * 100) / window.innerHeight;

        if (option == "viewPlaces") toucheYvh -= 11;

        if (toucheYvh >= 0 && toucheYvh < (option != "viewPlaces" ? 86 : 79))
          elementToResize.style.transform = `TranslateY(${toucheYvh}vh)`;
        break;

      case window.innerWidth > 650 && window.innerWidth < 1200:
        let toucheYvw =
          (event.targetTouches[0].pageX * 100) / window.innerWidth;

        if (toucheYvw > 14 && toucheYvw < 93)
          elementToResize.style.right = `${100 - toucheYvw}vw`;
        break;
    }
  });
};
