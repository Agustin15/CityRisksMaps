import { ContainMap } from "../components/map/ContainMap";
import { AppProviders } from "../contexts/AppProviders";
import { Helmet } from "react-helmet-async";

export const MapPage = () => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="index"></meta>
      </Helmet>
      <AppProviders>
        <ContainMap />
      </AppProviders>
    </>
  );
};
