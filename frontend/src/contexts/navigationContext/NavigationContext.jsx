import { useContext } from "react";
import { createContext, useState } from "react";
import { useRoutes } from "../routesContext/RoutesContext";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapControls } from "../MapContext";
import { getNewRoute } from "./functionsNavigation.js";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [routeNavigation, setRouteNavigation] = useState();
  const [polylineNavigation, setPolylineNavigation] = useState();
  const [polylineBackground, setPolylineBackground] = useState();
  const [currentStep, setCurrentStep] = useState();
  const [indexStep, setIndexStep] = useState(0);
  const [destinationArrived, setDestinationArrived] = useState(false);
  const [activeNavigationVoice, setActiveNavigationVoice] = useState(false);
  const [editRoute, setEditRoute] = useState(false);
  const [intermediates, setIntermediates] = useState([]);

  const map = useMap("mainMap");

  const { userLocation, setUserLocation } = useMapControls();
  const {
    routes,
    setIndexRouteSelected,
    setRoutes,
    polylines,
    setPolylines,
    setShowMenuRoutes,
    destinationLocation,
    transportSelected
  } = useRoutes();

  const handleNavigation = (indexRouteSelected) => {
    let polylineRouteFound;

    polylines.map((polyline, index) => {
      if (index != indexRouteSelected) polyline.setMap(null);
      else {
        polyline.setOptions({
          strokeOpacity: 1.0,
          strokeWeight: 12,
          zIndex: 1
        });
        polylineRouteFound = polyline;
      }
    });

    const polylineToBackground = new google.maps.Polyline({
      path: polylineRouteFound.getPath().getArray(),
      strokeColor: "#ffffff",
      strokeOpacity: 1.0,
      strokeWeight: 21,
      zIndex: 0,
      map: map
    });

    const routeFound = routes.find(
      (route, index) => index == indexRouteSelected
    );

    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: false,
      streetViewControl: false,
      center: userLocation,
      zoom: 25,
      tilt: 70
    });

    const pathFirstStep = google.maps.geometry.encoding.decodePath(
      routeFound.legs[0].steps[0].polyline.encodedPolyline
    );

    setUserLocation({
      lat: pathFirstStep[0].lat(),
      lng: pathFirstStep[0].lng()
    });

    setPolylines();
    setRoutes();
    setIndexRouteSelected();
    setShowMenuRoutes(false);
    setPolylineNavigation(polylineRouteFound);
    setPolylineBackground(polylineToBackground);
    setRouteNavigation(routeFound);
  };

  const handleCloseNavigation = () => {
    polylineNavigation.setMap(null);
    polylineBackground.setMap(null);

    setPolylineNavigation();
    setPolylineBackground();
    setRouteNavigation();
    setIndexStep();
    setCurrentStep();
    setEditRoute(false);

    if (activeNavigationVoice) setActiveNavigationVoice(false);

    if (destinationArrived == true) setDestinationArrived(false);

    google.maps.event.clearListeners(map, "click");

    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: true,
      zoomControl: true,
      streetViewControl: true,
      draggableCursor: "auto",
      center: userLocation,
      zoom: 15
    });
  };

  const recalculateRoute = async (intermediates) => {
    let originLocation = {
      latitude: userLocation.lat,
      longitude: userLocation.lng
    };

    const result = await getNewRoute(
      originLocation,
      destinationLocation,
      transportSelected,
      intermediates
    );

    if (result && result.routes) {
      const newRoute = result.routes[0];
      const pathRoute = new google.maps.geometry.encoding.decodePath(
        newRoute.polyline.encodedPolyline
      );

      polylineNavigation.setOptions({
        path: pathRoute,
        strokeWeight: 12,
        zIndex: 1
      });

      polylineBackground.setOptions({
        path: pathRoute,
        bacground: "#ffffff",
        strokeWeight: 21,
        zIndex: 0
      });

      setRouteNavigation(newRoute);
      setPolylineNavigation(polylineNavigation);
      setPolylineBackground(polylineBackground);
    }
  };

  const handleOptionVoice = () => {
    if (!activeNavigationVoice) {
      setActiveNavigationVoice(true);
      activateNavigationVoice(currentStep.navigationInstruction.instructions);
    } else setActiveNavigationVoice(false);
  };

  const activateNavigationVoice = (text) => {
    const synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.voice = synth.getVoices()[4];
    utterance.lang = "es-MX";
    utterance.volume = 0.5;

    synth.speak(utterance);
  };

  return (
    <NavigationContext.Provider
      value={{
        routeNavigation,
        polylineNavigation,
        polylineBackground,
        currentStep,
        setCurrentStep,
        indexStep,
        activeNavigationVoice,
        activateNavigationVoice,
        setIndexStep,
        setPolylineNavigation,
        destinationArrived,
        setDestinationArrived,
        editRoute,
        setEditRoute,
        intermediates,
        setIntermediates,
        handleCloseNavigation,
        handleNavigation,
        handleOptionVoice,
        recalculateRoute
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
