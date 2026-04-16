import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { useNavigation } from "../../../../contexts/navigationContext/NavigationContext";
import { DetailsIndication } from "./detailsIndication/DetailsIndication.jsx";
import { MenuOptions } from "./menuOptions/MenuOptions.jsx";

export const OptionsIndication = () => {
  const { currentStep } = useNavigation();

  return (
    <div>
      <MenuOptions />
      
      <MapControl position={ControlPosition.LEFT_BOTTOM}>
        <DetailsIndication currentStep={currentStep} />
      </MapControl>
    </div>
  );
};
