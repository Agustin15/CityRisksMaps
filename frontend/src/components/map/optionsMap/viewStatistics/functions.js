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

export const resize = (elementId) => {
  if (window.innerWidth >= 1200) return;

  const elementToResize = document.getElementById(elementId);

  if (!elementToResize) return;

  elementToResize.removeAttribute("style");

  const containOption = elementToResize.firstChild;

  if (elementToResize.getAnimations().length > 0) {
    elementToResize.getAnimations().map((animation) => animation.cancel());
  }

  if (containOption) resizeAction(elementToResize, containOption);

  removeEventListener("touchstart", resizeAction);
  removeEventListener("touchend", resizeAction);
};

const resizeAction = async (elementToResize, containOption) => {
  let clientYstart, clientYend, clientXstart, clientXend, animation;

  containOption.addEventListener("touchstart", async (event) => {
    clientYstart = event.targetTouches[0].clientY;
    clientXstart = event.targetTouches[0].clientX;
  });

  containOption.addEventListener("touchend", async (event) => {
    clientYend = event.changedTouches[0].clientY;
    clientXend = event.changedTouches[0].clientX;

    if (clientYend && clientYstart) {
      const animationTiming = {
        duration: 700,
        fill: "forwards"
      };

      switch (true) {
        case window.innerWidth <= 650:
          if (clientYstart < clientYend) {
            animation = [{ transform: "TranslateY(79vh)" }];
          } else {
            animation = [{ transform: "TranslateY(0vh)" }];
          }
          elementToResize.animate(animation, animationTiming);
          break;

        case window.innerWidth > 650 && window.innerWidth < 1200:
          if (clientXstart > clientXend) {
            animation = [{ transform: "TranslateX(-81vw)" }];
          } else {
            animation = [{ transform: "TranslateX(0vw)" }];
          }
          elementToResize.animate(animation, animationTiming);
          break;
      }
    }
  });
};
