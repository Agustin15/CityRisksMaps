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

export const resize = (event) => {
  if (window.innerWidth >= 1200) return;

  const elementToResize = event.target.parentElement.parentElement;

  if (!elementToResize) return;

  resizeAction(elementToResize);
};

const resizeAction = async (elementToResize) => {
  const animationTiming = {
    duration: 700,
    fill: "forwards"
  };
  let translate;

  if (elementToResize.getAnimations().length > 0) {
    translate = elementToResize
      .getAnimations()[0]
      .effect.getKeyframes()[0].transform;
  }

  switch (true) {
    case window.innerWidth <= 650:
      if (!translate || translate == "translateY(0vh)") {
        elementToResize.animate(
          [{ transform: "translateY(71vh)" }],
          animationTiming
        );
      } else
        elementToResize.animate(
          [{ transform: "translateY(0vh)" }],
          animationTiming
        );

      break;

    case window.innerWidth > 650 && window.innerWidth < 1200:
      if (!translate || translate == "translateX(0vw)") {
        elementToResize.animate(
          [{ transform: "translateX(-81vw)" }],
          animationTiming
        );
      } else
        elementToResize.animate(
          [{ transform: "translateX(0vw)" }],
          animationTiming
        );
      break;
  }
};
