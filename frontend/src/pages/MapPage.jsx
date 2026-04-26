import { ContainMap } from "../components/map/ContainMap";
import { AppProviders } from "../contexts/AppProviders";

export const MapPage = () => {
  return (
    <AppProviders>
      <ContainMap />
    </AppProviders>
  );
};
