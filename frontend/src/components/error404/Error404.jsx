import iconError404 from "../../assets/img/error404.png";
import { NoContentComponent } from "../noContentComponent/NoContentComponent";
import { Helmet } from "react-helmet-async";

export const Error404 = () => {
  return (
    <NoContentComponent
      title={"ERROR 404"}
      msj={"La pagina solicitada no se encontro en el servidor"}
      image={iconError404}
    />
  );
};
